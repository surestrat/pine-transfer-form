/**
 * Utility for debugging CORS issues
 */

/**
 * Tests the API endpoint to check if CORS is properly configured
 * @param {string} apiUrl - The API URL to test
 * @returns {Promise<Object>} - Object with information about the CORS test
 */
export const testCorsSetup = async (apiUrl) => {
	try {
		// Try a simple OPTIONS request first
		const optionsResponse = await fetch(apiUrl, {
			method: "OPTIONS",
			mode: "cors",
		});

		console.log("OPTIONS response headers:", optionsResponse.headers);

		// Now try a simple GET request
		const getResponse = await fetch(apiUrl, {
			method: "GET",
			mode: "cors",
		});

		return {
			success: true,
			message: "CORS appears to be configured correctly",
			optionsStatus: optionsResponse.status,
			getStatus: getResponse.status,
		};
	} catch (error) {
		console.error("CORS test failed:", error);
		return {
			success: false,
			message: `CORS test failed: ${error.message}`,
			error,
		};
	}
};

/**
 * Checks if the current environment likely has CORS issues
 * @returns {boolean} - True if CORS issues are likely
 */
export const isCorsIssueEnvironment = () => {
	// Check if we're running in a browser and on a different domain
	if (typeof window === "undefined") return false;

	const apiUrl = import.meta.env.VITE_PINEAPPLE_API_URL || "";
	if (!apiUrl) return false;

	try {
		const apiDomain = new URL(apiUrl).hostname;
		const currentDomain = window.location.hostname;

		// If domains don't match, CORS might be an issue
		return apiDomain !== currentDomain;
	} catch (e) {
		return false;
	}
};
