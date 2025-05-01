import axios from "axios";

// Ensure we use the correct endpoint from env variable - don't append paths
const API_URL =
	import.meta.env.VITE_PINE_API_URL || "https://pta.surestrat.xyz";

/**
 * Submits the form data to the Pine API endpoint.
 * @param {Object} payload - The full payload to send (should include all form and agent info)
 * @returns {Promise<Object>} - The API response
 */
export const submitForm = async (payload) => {
	try {
		console.log("Submitting to API URL:", API_URL);

		// Make the API request
		const response = await axios.post(API_URL, payload, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		// Log successful response
		console.log("API Response:", response.data);

		// Validate and return the response
		if (response.data) {
			// Log the redirect URL for debugging if present
			if (response.data.data && response.data.data.redirect_url) {
				console.log("Received redirect URL:", response.data.data.redirect_url);
			}
			return response.data;
		}

		return response.data;
	} catch (error) {
		// Enhanced error logging
		console.error("API Error details:", error);

		if (error.response) {
			// The server responded with a status code outside the 2xx range
			console.error("Response status:", error.response.status);
			console.error("Response data:", error.response.data);

			// Handle 405 Method Not Allowed error specifically
			if (error.response.status === 405) {
				throw new Error(
					"The API endpoint doesn't support this request method. Please contact support."
				);
			}

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
