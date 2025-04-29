/**
 * Utility to help with CORS issues by providing alternative approaches
 * if your server doesn't have CORS headers enabled.
 */

export const CORS_PROXY_URLS = {
	// Add some public CORS proxies that can be used when needed
	CORS_ANYWHERE: "https://cors-anywhere.herokuapp.com/",
	ALLORIGINS: "https://api.allorigins.win/raw?url=",
	LOCAL_PROXY: "/pineapple-api", // Use our local Vite proxy
};

/**
 * Prepends a CORS proxy URL to the given URL if needed
 * Note: Only use for development or when you control both the client and server
 *
 * @param {string} url - The original URL to fetch
 * @param {string} proxyType - The type of proxy to use (key from CORS_PROXY_URLS)
 * @returns {string} - URL with proxy prepended if enabled
 */
export const applyCorsProxy = (url, proxyType = "LOCAL_PROXY") => {
	// Only apply in development mode to avoid security issues in production
	if (import.meta.env.DEV && proxyType && CORS_PROXY_URLS[proxyType]) {
		// If using the local proxy, we need to handle the URL differently
		if (proxyType === "LOCAL_PROXY") {
			// Extract the path part of the URL for Pineapple API
			try {
				const urlObj = new URL(url);
				return `${CORS_PROXY_URLS[proxyType]}${urlObj.pathname}${urlObj.search}`;
			} catch (e) {
				console.error("Error parsing URL:", e);
				return url; // Return original URL if parsing fails
			}
		}
		return `${CORS_PROXY_URLS[proxyType]}${url}`;
	}
	return url;
};

/**
 * Provides headers that can help with CORS requests
 * @param {string} apiKey - The API key
 * @param {string} apiSecret - The API secret
 */
export const getCorsHeaders = (apiKey, apiSecret) => {
	const headers = {
		"Content-Type": "application/json",
		Accept: "application/json",
	};

	// Add authorization if key and secret are provided
	if (apiKey && apiSecret) {
		headers.Authorization = `Bearer KEY=${apiKey} SECRET=${apiSecret}`;
	}

	return headers;
};
