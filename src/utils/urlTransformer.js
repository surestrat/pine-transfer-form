/**
 * Transform a localhost URL to use pineapple.co.za domain
 * @param {string} url - The original URL with localhost
 * @returns {string} - Transformed URL with www.pineapple.co.za (without port)
 */
export const transformPineappleUrl = (url) => {
	if (!url) return "";

	try {
		// Parse the URL
		const urlObj = new URL(url);

		// Check if it's a localhost URL
		if (urlObj.hostname === "localhost") {
			// Replace the host and protocol
			urlObj.hostname = "web.pineapple.co.za";
			urlObj.protocol = "http:"; // Use https for production domain

			// Remove any port number
			urlObj.port = "";

			// Return the transformed URL
			return urlObj.toString();
		}

		// Return the original URL if not localhost
		return url;
	} catch (error) {
		console.error("Error transforming URL:", error);
		return url; // Return original URL if any error occurs
	}
};
