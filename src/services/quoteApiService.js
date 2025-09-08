import axios from 'axios';
import { processAPIError } from '@utils/errorHandler';

// Get the API URL for quotes
const QUOTE_API_URL = import.meta.env.VITE_QUOTE_API_URL || "https://api.surestrat.xyz/api/v1/quote";

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
        
        // Handle the new structured API response format
        const responseData = response.data;
        
        // Check if response has the new structured format
        if (responseData && typeof responseData.success === 'boolean') {
            if (responseData.success) {
                // Successful response - return the data
                console.log("[quoteApiService] Successful quote data:", responseData.data);
                return responseData.data;
            } else {
                // Error response - process and throw structured error
                const error = processAPIError({ response: { data: responseData } }, 'quoteApiService');
                console.error("[quoteApiService] API returned error:", error);
                throw error;
            }
        } else {
            // Legacy response format - assume success and return as-is
            console.log("[quoteApiService] Legacy response format detected:", responseData);
            return responseData;
        }
        
    } catch (error) {
        console.error("[quoteApiService] Quote submission error:", error);
        
        // If it's already a processed error, just throw it
        if (error.name === 'APIError' || error.name === 'ValidationError' || 
            error.name === 'DuplicateError' || error.name === 'NetworkError') {
            throw error;
        }
        
        // Process unhandled errors
        const processedError = processAPIError(error, 'quoteApiService');
        throw processedError;
    }
};

// Poll for quote results (if the API supports async processing)
export const pollQuoteResult = async (quoteId, maxAttempts = 30, intervalMs = 5000) => {
    console.log(`[quoteApiService] Polling for quote result: ${quoteId}`);
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await quoteAxiosInstance.get(`${QUOTE_API_URL}/${quoteId}/status`);
            
            // Handle new structured response format
            const responseData = response.data;
            
            if (responseData && typeof responseData.success === 'boolean') {
                if (responseData.success) {
                    const data = responseData.data;
                    if (data.status === 'completed') {
                        console.log("[quoteApiService] Quote completed:", data);
                        return data;
                    } else if (data.status === 'failed') {
                        const error = processAPIError({ response: { data: responseData } }, 'quoteApiService');
                        throw error;
                    }
                } else {
                    // Error response
                    const error = processAPIError({ response: { data: responseData } }, 'quoteApiService');
                    throw error;
                }
            } else {
                // Legacy format
                if (responseData.status === 'completed') {
                    console.log("[quoteApiService] Quote completed:", responseData);
                    return responseData;
                } else if (responseData.status === 'failed') {
                    const error = processAPIError({ response: { data: { success: false, error: { code: 'QUOTE_API_ERROR', message: 'Quote processing failed' } } } }, 'quoteApiService');
                    throw error;
                }
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
    
    const timeoutError = processAPIError({ 
        response: { 
            data: { 
                success: false, 
                error: { 
                    code: 'QUOTE_API_ERROR', 
                    message: 'Quote processing timed out. Please try again later.' 
                } 
            } 
        } 
    }, 'quoteApiService');
    throw timeoutError;
};

// Get quote by ID
export const getQuoteById = async (quoteId) => {
    try {
        console.log("[quoteApiService] Fetching quote with ID:", quoteId);
        
        const response = await quoteAxiosInstance.get(`${QUOTE_API_URL}/${quoteId}`, {
            headers: {
                "Accept": "application/json",
                "X-Request-ID": Date.now(),
                "X-Source": "SureStrat-Portal"
            }
        });
        
        console.log("[quoteApiService] Quote retrieval response:", response);
        
        // Your backend returns direct quote data, not wrapped in success/data structure
        const quoteData = response.data;
        
        // Transform to expected format for frontend
        const transformedQuote = {
            quoteId: quoteData.quoteId || quoteData.id,
            premium: parseFloat(quoteData.premium),
            excess: parseFloat(quoteData.excess),
            externalReferenceId: quoteData.internalReference,
            status: quoteData.status?.toLowerCase() === 'pending' ? 'active' : quoteData.status?.toLowerCase(),
            createdAt: quoteData.created_at,
            agentEmail: quoteData.agentEmail,
            agentBranch: quoteData.agentBranch
        };
        
        console.log("[quoteApiService] Transformed quote data:", transformedQuote);
        return transformedQuote;
        
    } catch (error) {
        console.error("[quoteApiService] Quote retrieval error:", error);
        
        // Handle 404 specifically
        if (error.response?.status === 404) {
            const notFoundError = new Error('Quote not found or may have expired.');
            notFoundError.name = 'QuoteNotFoundError';
            notFoundError.code = 'QUOTE_NOT_FOUND';
            throw notFoundError;
        }
        
        // Handle other HTTP errors
        if (error.response?.status) {
            const apiError = new Error(`Failed to retrieve quote: ${error.response.status}`);
            apiError.name = 'QuoteApiError';
            apiError.code = 'QUOTE_RETRIEVAL_ERROR';
            throw apiError;
        }
        
        // Handle network errors
        const networkError = new Error('Network error while retrieving quote information.');
        networkError.name = 'NetworkError';
        networkError.code = 'NETWORK_ERROR';
        throw networkError;
    }
};
