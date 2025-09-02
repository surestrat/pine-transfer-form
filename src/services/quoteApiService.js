import axios from 'axios';

// Get the API URL for quotes
const QUOTE_API_URL = import.meta.env.VITE_QUOTE_API_URL || "http://localhost:4000/api/v1/quote";

console.log("[quoteApiService] Using QUOTE_API_URL:", QUOTE_API_URL);

// Axios instance for quote requests
const quoteAxiosInstance = axios.create({
    timeout: 60000, // 60 second timeout for quotes (they take longer)
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
});

// Add retry logic for quote requests
quoteAxiosInstance.interceptors.response.use(undefined, async (err) => {
    const { config } = err;
    if (!config || !config.retry) {
        return Promise.reject(err);
    }
    config.retryCount = config.retryCount ?? 0;
    if (config.retryCount >= config.retry) {
        return Promise.reject(err);
    }
    config.retryCount += 1;
    const delayMs = config.retryDelay || 2000; // Longer delay for quotes
    await new Promise(resolve => setTimeout(resolve, delayMs));
    return quoteAxiosInstance(config);
});

export class QuoteApiError extends Error {
    constructor(message, status, details = null) {
        super(message);
        this.name = 'QuoteApiError';
        this.status = status;
        this.details = details;
    }
}

export class QuoteNetworkError extends Error {
    constructor(message) {
        super(message || 'Unable to connect to the quote server. Please check your internet connection.');
        this.name = 'QuoteNetworkError';
    }
}

export const submitQuote = async (payload) => {
    try {
        console.log("[quoteApiService] Submitting quote with payload:", payload);
        
        const response = await quoteAxiosInstance.post(QUOTE_API_URL, payload, {
            retry: 2, // Retry failed requests 2 times
            retryDelay: 2000, // Wait 2 seconds between retries
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Request-ID": Date.now(),
                "X-Source": "SureStrat-Portal"
            }
        });
        
        console.log("[quoteApiService] Quote response:", response);
        return response.data;
    } catch (error) {
        console.error("[quoteApiService] Quote submission error:", error);
        
        // Network errors
        if (!error.response) {
            throw new QuoteNetworkError(
                'Unable to connect to the quote server. Please check your internet connection and try again.'
            );
        }

                // Log the error response for debugging
        console.error("[quoteApiService] Error response data:", error.response.data);
        console.error("[quoteApiService] Error response status:", error.response.status);
        
        // API errors
        switch (error.response.status) {
            case 400:
                throw new QuoteApiError(
                    'The submitted quote information was invalid. Please check your inputs and try again.',
                    400,
                    error.response.data
                );
            case 401:
                throw new QuoteApiError(
                    'Your session has expired. Please refresh the page and try again.',
                    401
                );
            case 403:
                throw new QuoteApiError(
                    'You do not have permission to perform this action.',
                    403
                );
            case 422: {
                const validationMessage = error.response.data?.detail || error.response.data?.message || 'Validation failed';
                throw new QuoteApiError(
                    `Validation failed: ${validationMessage}`,
                    422,
                    error.response.data
                );
            }
            case 429:
                throw new QuoteApiError(
                    'Too many quote requests. Please wait a moment and try again.',
                    429
                );
            case 500:
                throw new QuoteApiError(
                    'An unexpected server error occurred while processing your quote.',
                    500
                );
            default:
                throw new QuoteApiError(
                    'An unexpected error occurred. Please try again.',
                    error.response.status
                );
        }
    }
};

// Poll for quote results (if the API supports async processing)
export const pollQuoteResult = async (quoteId, maxAttempts = 30, intervalMs = 5000) => {
    console.log(`[quoteApiService] Polling for quote result: ${quoteId}`);
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await quoteAxiosInstance.get(`${QUOTE_API_URL}/${quoteId}/status`);
            
            if (response.data.status === 'completed') {
                console.log("[quoteApiService] Quote completed:", response.data);
                return response.data;
            } else if (response.data.status === 'failed') {
                throw new QuoteApiError('Quote processing failed', 500, response.data);
            }
            
            // Still processing, wait and try again
            if (attempt < maxAttempts) {
                console.log(`[quoteApiService] Quote still processing, attempt ${attempt}/${maxAttempts}`);
                await new Promise(resolve => setTimeout(resolve, intervalMs));
            }
        } catch (error) {
            if (attempt === maxAttempts) {
                throw error;
            }
            // Wait and retry on error
            await new Promise(resolve => setTimeout(resolve, intervalMs));
        }
    }
    
    throw new QuoteApiError('Quote processing timed out. Please try again later.', 408);
};
