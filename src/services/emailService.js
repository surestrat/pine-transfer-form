import axios from "axios";

// Configuration (should be in environment variables in production)
const EMAIL_API_URL = "https://email.example.com/api/tx";
const EMAIL_API_USER = "api_user";
const EMAIL_API_TOKEN = "token";
const TEMPLATE_ID = 1; // Replace with your actual template ID
const NOTIFICATION_EMAILS = ["agent@surestrat.com", "admin@surestrat.com"]; // Replace with actual notification emails

/**
 * Sends notification emails through Listmonk API
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
		// Create authentication header for Basic Auth
		const auth = {
			username: EMAIL_API_USER,
			password: EMAIL_API_TOKEN,
		};

		// Format date for email
		const currentDate = new Date().toLocaleString("en-ZA", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});

		// Prepare data payload for email template
		const emailData = {
			subscriber_emails: NOTIFICATION_EMAILS,
			template_id: TEMPLATE_ID,
			content_type: "html",
			data: {
				// Customer info
				customer_name: `${formData.first_name} ${formData.last_name}`,
				customer_email: formData.email,
				customer_id: formData.id_number,
				customer_phone: formData.contact_number,
				quote_id: formData.quote_id,

				// Agent info
				agent_name: agentInfo.agent,
				branch: agentInfo.branch,

				// Transaction info
				pine_client_id: pine_client_id,
				redirect_url: url,
				submission_date: currentDate,

				// Additional info for email template
				app_name: "SureStrat Pineapple Transfer Form",
			},
		};

		// Make API request to send email
		const response = await axios.post(EMAIL_API_URL, emailData, { auth });

		if (response.data && response.data.data === true) {
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
