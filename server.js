const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.VITE_EMAIL_SERVER_PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Email endpoint
app.post("/api/send-email", async (req, res) => {
	try {
		let { to, from, subject, html, text } = req.body;

		// Use NOTIFICATION_EMAILS from env if 'to' is not provided or empty
		if (!to || to.trim() === "") {
			to = process.env.NOTIFICATION_EMAILS || "";
		}

		if (!to || !subject || !html) {
			return res.status(400).json({
				success: false,
				error: "Missing required fields to, subject, or html",
			});
		}

		console.log("Received email request:", {
			to,
			from,
			subject,
		});

		// Create transporter with cPanel SMTP settings
		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST || "",
			port: parseInt(process.env.SMTP_PORT || ""),
			secure: process.env.SMTP_SECURE === "true" || true,
			auth: {
				user: process.env.SMTP_USER || "",
				pass: process.env.SMTP_PASS || "",
			},
		});

		// Verify connection configuration
		try {
			await transporter.verify();
			console.log("SMTP connection verified successfully");
		} catch (verifyError) {
			console.error("SMTP verification failed:", verifyError);
			return res.status(500).json({
				success: false,
				error: `SMTP server connection failed: ${verifyError.message}`,
			});
		}

		// Split recipients if comma-separated
		const recipients = to.includes(",")
			? to.split(",").map((email) => email.trim())
			: [to];

		// Send emails individually
		const results = [];
		for (const recipient of recipients) {
			try {
				const info = await transporter.sendMail({
					from: from || "",
					to: recipient,
					subject,
					html,
					text: text || html.replace(/<[^>]*>/g, ""),
				});

				results.push({
					recipient,
					messageId: info.messageId,
					success: true,
				});

				console.log(`Email sent to ${recipient}, messageId: ${info.messageId}`);
			} catch (err) {
				console.error(`Failed to send to ${recipient}:`, err);
				results.push({
					recipient,
					error: err.message,
					success: false,
				});
			}
		}

		// Check if all sends were successful
		const allSuccessful = results.every((r) => r.success);

		res.status(allSuccessful ? 200 : 207).json({
			success: allSuccessful,
			message: allSuccessful
				? `Emails successfully sent to ${results.length} recipients`
				: "Some emails failed to send",
			results,
		});
	} catch (error) {
		console.error("Server error processing email:", error);
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

// Status endpoint
app.get("/api/status", (req, res) => {
	res.json({ status: "Email server running with cPanel SMTP configuration" });
});

// Start server
app.listen(PORT, () => {
	console.log(`Email server running on port ${PORT}`);
	console.log(`Send emails to: http://localhost:${PORT}/api/send-email`);
	console.log(`Using SMTP server: ${process.env.SMTP_HOST || ""}`);
});
