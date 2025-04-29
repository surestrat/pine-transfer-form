import axios from "axios";
import { applyCorsProxy, getCorsHeaders } from "../utils/corsProxy";

/**
 * Submit lead using the Vite development proxy to avoid CORS issues
 */
export const submitLeadViaProxy = async (payload) => {
	// Get the API configuration from environment variables
	const API_PATH = "/users/motor_lead";
	const API_KEY = import.meta.env.VITE_API_KEY;
	const API_SECRET = import.meta.env.VITE_API_SECRET;

	// Use our local proxy in development
	const proxyUrl = applyCorsProxy(
		`http://gw-test.pineapple.co.za${API_PATH}`,
		"LOCAL_PROXY"
	);

	try {
		console.log("Submitting via proxy to:", proxyUrl);
		console.log("Request payload:", JSON.stringify(payload));

		// Get headers with proper authorization
		const headers = getCorsHeaders(API_KEY, API_SECRET);
		console.log("Using headers:", JSON.stringify(headers));

		const response = await axios.post(proxyUrl, payload, {
			headers,
			timeout: 15000, // Increase timeout to 15 seconds
			validateStatus: (status) => status < 500, // Consider only 500+ as errors
		});

		// Handle both 2xx success and 4xx failures as responses to parse
		console.log("Proxy API Response:", response.status, response.statusText);

		if (response.status >= 200 && response.status < 300) {
			return response.data;
		} else {
			// For 4xx responses, extract error details and throw appropriate error
			const errorResponse = response.data;
			console.error("API Error response:", errorResponse);

			if (errorResponse && errorResponse.detail) {
				throw new Error(`API Error: ${JSON.stringify(errorResponse.detail)}`);
			}

			throw new Error(`API Error: ${response.statusText || "Unknown error"}`);
		}
	} catch (error) {
		console.error("API Error via proxy:", error);

		if (axios.isAxiosError(error)) {
			// Enhanced error handling
			if (error.response) {
				// The server responded with a status code outside the 2xx range
				const errorResponse = error.response.data;
				console.error("Error response data:", errorResponse);

				// Check for different error formats
				if (errorResponse?.detail && Array.isArray(errorResponse.detail)) {
					// Format like {detail: [{msg: "error message", ...}, ...]}
					const firstError = errorResponse.detail[0];
					const errorMessage = firstError?.msg || JSON.stringify(firstError);
					throw new Error(`API Error: ${errorMessage}`);
				} else if (
					errorResponse?.detail &&
					typeof errorResponse.detail === "string"
				) {
					// Format like {detail: "error message"}
					throw new Error(`API Error: ${errorResponse.detail}`);
				} else if (errorResponse?.error) {
					// Format like {error: "error message"}
					throw new Error(`API Error: ${errorResponse.error}`);
				} else {
					// Use status text as fallback
					throw new Error(
						`API Error: ${error.response.statusText || error.message}`
					);
				}
			} else if (error.request) {
				// The request was made but no response was received
				throw new Error("Network Error: No response received from the server");
			} else {
				// Something happened in setting up the request
				throw new Error(`Request Error: ${error.message}`);
			}
		}

		// For non-Axios errors
		throw new Error(
			"An unexpected error occurred while submitting your information"
		);
	}
};
