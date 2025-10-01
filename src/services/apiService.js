import axios from 'axios';
import { processAPIError } from '@utils/errorHandler';

// Get the API URL from environment variables
const API_URL = 
    import.meta.env.VITE_PINE_API_URL || 
    (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1/transfer` : null) || 
    "https://api.usa-solarenergy.com/api/v1/transfer";

console.log("[apiService] Environment check:");
console.log("- VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("- VITE_PINE_API_URL:", import.meta.env.VITE_PINE_API_URL);
console.log("- Using API_URL:", API_URL);

// Axios instance with retry configuration
const axiosInstance = axios.create({
    timeout: 30000, // 30 second timeout
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
});

// Add retry logic
axiosInstance.interceptors.response.use(undefined, async (err) => {
    const { config } = err;
    if (!config || !config.retry) {
        return Promise.reject(err);
    }
    config.retryCount = config.retryCount ?? 0;
    if (config.retryCount >= config.retry) {
        return Promise.reject(err);
    }
    config.retryCount += 1;
    const delayMs = config.retryDelay || 1000;
    await new Promise(resolve => setTimeout(resolve, delayMs));
    return axiosInstance(config);
});

export const submitForm = async (payload) => {
    try {
        console.log("[apiService] submitForm called with payload:", payload);
        
        // Format the customer info
        const customerInfo = {
            source: "SureStrat",
            first_name: payload.first_name,
            last_name: payload.last_name,
            contact_number: payload.contact_number,
            email: payload.email.trim(), // Email is required
        };

        // Only add optional fields if they exist and have non-empty values
        if (payload.quote_id) {
            const trimmedQuoteId = payload.quote_id.trim();
            if (trimmedQuoteId.length > 0) customerInfo.quote_id = trimmedQuoteId;
        }

        if (payload.id_number) {
            const trimmedIdNumber = payload.id_number.trim();
            if (trimmedIdNumber.length > 0) customerInfo.id_number = trimmedIdNumber;
        }

        // Format the payload to match the API schema
        const formattedPayload = {
            customer_info: customerInfo,
            agent_info: {
                agent_email: payload.agent_email.trim(),
                branch_name: payload.branch_name,
            }
        };

        console.log("[apiService] Posting to API_URL:", API_URL);
        console.log("[apiService] Formatted payload:", formattedPayload);

        // Add request timeout handling
        const timeoutDuration = 30000; // 30 seconds
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('Request timed out. Please try again.'));
            }, timeoutDuration);
        });

        const fetchPromise = axiosInstance.post(API_URL, formattedPayload, {
            retry: 3, // Will retry failed requests 3 times
            retryDelay: 1000, // Wait 1 second between retries
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Request-ID": Date.now() // Add request tracking
            }
        });

        const response = await Promise.race([fetchPromise, timeoutPromise]);
        console.log("[apiService] API response:", response);
        
        // Handle the new structured API response format
        const responseData = response.data;
        
        // Check if response has the new structured format
        if (responseData && typeof responseData.success === 'boolean') {
            if (responseData.success) {
                // Successful response - return the data
                console.log("[apiService] Successful response data:", responseData.data);
                return responseData.data;
            } else {
                // Error response - process and throw structured error
                const error = processAPIError({ response: { data: responseData } }, 'apiService');
                console.error("[apiService] API returned error:", error);
                throw error;
            }
        } else {
            // Legacy response format - assume success and return as-is
            console.log("[apiService] Legacy response format detected:", responseData);
            return responseData;
        }
        
    } catch (error) {
        console.error("[apiService] Error during submitForm:", error);
        
        // If it's already a processed error, just throw it
        if (error.name === 'APIError' || error.name === 'ValidationError' || 
            error.name === 'DuplicateError' || error.name === 'NetworkError') {
            throw error;
        }
        
        // Process unhandled errors
        const processedError = processAPIError(error, 'apiService');
        throw processedError;
    }
};
