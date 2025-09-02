import axios from 'axios';

// Get the API URL from environment variables
const API_URL =
    import.meta.env.VITE_PINE_API_URL || "https://api.surestrat.xyz/api/v1/transfer";
console.log("[apiService] Using API_URL:", API_URL);

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
    const { config, message } = err;
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

// Custom error types for better error handling
class ApiError extends Error {
    constructor(message, status, details = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.details = details;
    }
}

class NetworkError extends Error {
    constructor(message) {
        super(message || 'Network connection issue. Please check your internet connection.');
        this.name = 'NetworkError';
    }
}

class ValidationError extends Error {
    constructor(details) {
        super('Validation Error');
        this.name = 'ValidationError';
        this.details = details;
    }
}

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
        return response.data;
    } catch (error) {
        console.error("[apiService] Error during submitForm:", error);
        // Network errors
        if (!error.response) {
            throw new NetworkError(
                'Unable to connect to the server. Please check your internet connection and try again.'
            );
        }

        // API errors
        switch (error.response.status) {
            case 400:
                throw new ApiError(
                    'The submitted information was invalid. Please check your inputs and try again.',
                    400,
                    error.response.data
                );
            case 401:
                throw new ApiError(
                    'Your session has expired. Please refresh the page and try again.',
                    401
                );
            case 403:
                throw new ApiError(
                    'You do not have permission to perform this action.',
                    403
                );
            case 422:
                throw new ValidationError(error.response.data.detail);
            case 429:
                throw new ApiError(
                    'Too many requests. Please wait a moment and try again.',
                    429
                );
            case 500:
                throw new ApiError(
                    'An unexpected server error occurred. Our team has been notified.',
                    500
                );
            default:
                throw new ApiError(
                    'An unexpected error occurred. Please try again.',
                    error.response.status
                );
        }
    }
};
