import axios from "axios";

// Get the API URL from environment variables
const API_URL =
	import.meta.env.VITE_PINE_API_URL || "https://api.surestrat.xyz/api/v1/transfer";

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
				contact_number: payload.contact_number,
				// Handle optional fields with explicit null values
				email: payload.email || null,
				id_number: payload.id_number || null,
				quote_id: payload.quote_id || null,
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
			console.error("Response status:", error.response.status);
			console.error("Response data:", error.response.data);

			// Handle 422 Validation Error specifically
			if (error.response.status === 422) {
				const errData = error.response.data;
				if (Array.isArray(errData.detail)) {
					// Format validation errors into a user-friendly message
					const validationErrors = errData.detail
						.map((err) => {
							const field = err.loc[err.loc.length - 1];
							return `${field}: ${err.msg}`;
						})
						.join(", ");
					throw new Error(validationErrors);
				}
				throw new Error(errData.detail || "Validation error occurred");
			}

			// Handle other error responses
			const errData = error.response.data;
			throw new Error(
				errData.error ||
					errData.detail ||
					errData.message ||
					`Server error: ${error.response.status} ${error.response.statusText}`
			);
		} else if (error.request) {
			throw new Error(
				"No response received from server. Please check your internet connection."
			);
		} else {
			throw new Error(`Request setup error: ${error.message}`);
		}
	}
};
