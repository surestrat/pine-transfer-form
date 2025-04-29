import axios from "axios";

const API_URL = import.meta.env.VITE_PINEAPPLE_API_URL || "";
// Format the bearer token exactly as shown in the Postman collection
const API_KEY = import.meta.env.VITE_API_KEY || "";
const API_SECRET = import.meta.env.VITE_API_SECRET || "";
const BEARER_TOKEN = `KEY=${API_KEY} SECRET=${API_SECRET}`;

export const submitLead = async (payload) => {
	try {
		console.log("Submitting to URL:", API_URL); // Log URL for debugging

		const response = await axios.post(API_URL, payload, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${BEARER_TOKEN}`,
			},
		});

		console.log("API Response:", response.status, response.statusText);
		return response.data;
	} catch (error) {
		console.error("API Error details:", error);

		// Check specifically for CORS errors
		if (error.message && error.message.includes("Network Error")) {
			console.error("CORS or network issue detected");
			throw new Error(
				"Network error: This may be due to a CORS issue or the API server being unreachable"
			);
		}

		if (axios.isAxiosError(error) && error.response) {
			// Handle structured API errors
			const errorResponse = error.response.data;

			// Check if errorResponse and detail exist before accessing properties
			if (
				errorResponse &&
				errorResponse.detail &&
				Array.isArray(errorResponse.detail) &&
				errorResponse.detail.length > 0
			) {
				const firstError = errorResponse.detail[0];
				// Check if firstError and msg exist
				const errorMessage =
					firstError && firstError.msg ? firstError.msg : "Unknown API error";
				throw new Error(`API Error: ${errorMessage}`);
			}

			// Fallback to status text if detail is not available or not in expected format
			throw new Error(
				`API Error: ${error.response.statusText || error.message}`
			);
		}

		// Handle non-Axios errors or errors without a response
		throw new Error(
			"An unexpected error occurred while submitting your information"
		);
	}
};
