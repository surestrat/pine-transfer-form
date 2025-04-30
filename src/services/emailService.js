import axios from "axios";

// Use local backend endpoint
const EMAIL_API_URL = "/api/send-email";
const NOTIFICATION_EMAILS = ["agent@surestrat.com", "admin@surestrat.com"]; // Update as needed

/**
 * Sends notification emails through your Express/nodemailer backend
 * @param {Object} formData - Customer details from the form
 * @param {Object} agentInfo - Agent information (name/branch)
 * @param {string} pine_client_id - UUID from Pineapple API
 * @param {string} url - Transformed redirect URL
 */
export const sendNotificationEmails = async (
	formData,
	agentInfo,
	pine_client_id,
	url
) => {
	try {
		// Format date for email
		const currentDate = new Date().toLocaleString("en-ZA", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});

		// Compose email content
		const subject = "New Pineapple Transfer Form Submission";
		const html = `
			<h2>New Pineapple Transfer Form Submission</h2>
			<p><strong>Customer Name:</strong> ${formData.first_name} ${formData.last_name}</p>
			<p><strong>Email:</strong> ${formData.email}</p>
			<p><strong>ID Number:</strong> ${formData.id_number}</p>
			<p><strong>Contact Number:</strong> ${formData.contact_number}</p>
			<p><strong>Quote ID:</strong> ${formData.quote_id}</p>
			<p><strong>Agent:</strong> ${agentInfo.agent}</p>
			<p><strong>Branch:</strong> ${agentInfo.branch}</p>
			<p><strong>Pine Client ID:</strong> ${pine_client_id}</p>
			<p><strong>Redirect URL:</strong> <a href="${url}">${url}</a></p>
			<p><strong>Submission Date:</strong> ${currentDate}</p>
		`;

		const payload = {
			to: NOTIFICATION_EMAILS.join(","),
			from: "no-reply@surestrat.co.za",
			subject,
			html,
			text: html.replace(/<[^>]*>/g, ""),
		};

		const response = await axios.post(EMAIL_API_URL, payload);

		if (response.data && response.data.success) {
			console.log("Notification emails sent successfully");
			return true;
		} else {
			throw new Error("Email API returned an unexpected response");
		}
	} catch (error) {
		console.error("Failed to send notification emails:", error);
		throw error;
	}
};
