import axios from "axios";

// Get the API URL from environment variables
const API_URL =
	import.meta.env.VITE_PINE_API_URL || "https://pta.surestrat.xyz/submit-form";

/**
 * Submits the form data to the Pine API endpoint.
 * @param {Object} payload - The full payload to send (should include all form and agent info)
 * @returns {Promise<Object>} - The API response
 */
export const submitForm = async (payload) => {
	try {
		console.log("Submitting to API URL:", API_URL);

		// Format payload to match the server SubmissionData schema
		const formattedPayload = {
			customer_info: {
				first_name: payload.first_name,
				last_name: payload.last_name,
				email: payload.email,
				contact_number: payload.contact_number,
				id_number: payload.id_number || undefined,
				quote_id: payload.quote_id || undefined,
			},
			agent_info: {
				agent_name: payload.agent_name,
				branch_name: payload.branch_name,
			},
		};

		console.log("Sending formatted payload:", formattedPayload);

		// Make the API request
		const response = await axios.post(API_URL, formattedPayload, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		// Log successful response
		console.log("API Response:", response.data);

		return response.data;
	} catch (error) {
		// Enhanced error logging
		console.error("API Error details:", error);

		if (error.response) {
			// The server responded with a status code outside the 2xx range
			console.error("Response status:", error.response.status);
			console.error("Response data:", error.response.data);

			// Extract error message from response if available
			const errData = error.response.data;
			const message =
				errData.error ||
				errData.detail ||
				errData.message ||
				`Server error: ${error.response.status} ${error.response.statusText}`;
			throw new Error(message);
		} else if (error.request) {
			// The request was made but no response was received
			throw new Error(
				"No response received from server. Please check your internet connection."
			);
		} else {
			// Something happened in setting up the request
			throw new Error(`Request setup error: ${error.message}`);
		}
	}
};
