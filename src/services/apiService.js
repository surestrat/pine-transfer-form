import axios from "axios";

const API_URL =
	import.meta.env.VITE_PINE_API_URL || "https://pta.surestrat.xyz/submit-form";

/**
 * Submits the form data to the new Pine API endpoint.
 * @param {Object} payload - The full payload to send (should include all form and agent info)
 * @returns {Promise<Object>} - The API response
 */
export const submitForm = async (payload) => {
	try {
		const response = await axios.post(API_URL, payload, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		// Validate that we have a proper response
		if (response.data) {
			// Log the redirect URL for debugging if present
			if (response.data.data && response.data.data.redirect_url) {
				console.log("Received redirect URL:", response.data.data.redirect_url);
			}
			return response.data;
		}

		return response.data;
	} catch (error) {
		console.error("API Error details:", error);

		if (error.response && error.response.data) {
			const errData = error.response.data;
			const message = errData.error || errData.detail || error.message;
			throw new Error(message);
		}
		throw new Error(
			error.message ||
				"An unexpected error occurred while submitting your information"
		);
	}
};
