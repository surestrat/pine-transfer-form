/**
 * Centralized error handling utility for API responses
 * Maps API error codes to user-friendly messages and actions
 */

// Field name mapping for validation errors
const FIELD_LABELS = {
  'first_name': 'First Name',
  'last_name': 'Last Name', 
  'email': 'Email Address',
  'contact_number': 'Contact Number',
  'id_number': 'ID Number',
  'quote_id': 'Quote ID',
  'agent_email': 'Agent Email',
  'branch_name': 'Office',
  'vehicles': 'Vehicle Information',
  'make': 'Vehicle Make',
  'model': 'Vehicle Model',
  'year': 'Vehicle Year',
  'value': 'Vehicle Value'
};

// Extract field name from nested path (e.g., "vehicles -> 0 -> make" -> "make")
const extractFieldName = (fieldPath) => {
  if (!fieldPath) return 'Unknown field';
  
  // Handle nested field paths like "vehicles -> 0 -> make"
  const parts = fieldPath.split(' -> ');
  const lastPart = parts[parts.length - 1];
  
  // Return the label if available, otherwise the field name
  return FIELD_LABELS[lastPart] || lastPart;
};

/**
 * Custom error classes for different error types
 */
export class APIError extends Error {
  constructor(message, code, details = null, technicalMessage = null) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.details = details;
    this.technicalMessage = technicalMessage;
  }
}

export class ValidationError extends APIError {
  constructor(message, validationErrors, technicalMessage = null) {
    super(message, 'VALIDATION_ERROR', { validation_errors: validationErrors }, technicalMessage);
    this.name = 'ValidationError';
    this.validationErrors = validationErrors;
  }
}

export class DuplicateError extends APIError {
  constructor(message, details, technicalMessage = null) {
    super(message, 'TRANSFER_DUPLICATE', details, technicalMessage);
    this.name = 'DuplicateError';
  }
}

export class NetworkError extends APIError {
  constructor(message = 'Network connection issue. Please check your internet connection.') {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

/**
 * Process API error response and return structured error
 */
export const processAPIError = (error, context = 'API') => {
  console.error(`[${context}] Processing error:`, error);

  // Network errors (no response received)
  if (!error.response) {
    return new NetworkError(
      'Unable to connect to the server. Please check your internet connection and try again.'
    );
  }

  // Check if response has the new structured format
  const responseData = error.response.data;
  
  if (responseData && responseData.success === false && responseData.error) {
    const { code, message, technical_message, details } = responseData.error;
    
    switch (code) {
      case 'VALIDATION_ERROR':
        return new ValidationError(
          message || 'Please check the provided data and try again.',
          details?.validation_errors || [],
          technical_message
        );
        
      case 'TRANSFER_DUPLICATE':
        return new DuplicateError(
          message || 'This person has already submitted a transfer request.',
          details,
          technical_message
        );
        
      case 'QUOTE_API_ERROR':
      case 'TRANSFER_API_ERROR': {
        // Extract specific Pineapple error message if available
        let userMessage = message || 'Unable to process your request. Please try again later.';
        
        if (technical_message?.includes('Pineapple API error:')) {
          try {
            // Extract the JSON part from the technical message
            const jsonMatch = technical_message.match(/Pineapple API error: ({.*})/);
            if (jsonMatch) {
              const pineappleError = JSON.parse(jsonMatch[1].replace(/'/g, '"'));
              if (pineappleError.message) {
                userMessage = pineappleError.message;
              }
            }
          } catch {
            // If parsing fails, fall back to extracting just the message text
            const messageMatch = technical_message.match(/'message': '([^']+)'/);
            if (messageMatch) {
              userMessage = messageMatch[1];
            }
          }
        }
        
        return new APIError(
          userMessage,
          code,
          details,
          technical_message
        );
      }
        
      case 'QUOTE_STORAGE_ERROR':
      case 'TRANSFER_STORAGE_ERROR':
        return new APIError(
          message || 'Unable to save your request. Please try again.',
          code,
          details,
          technical_message
        );
        
      case 'QUOTE_VALIDATION_ERROR':
        return new ValidationError(
          message || 'Please check your quote information and try again.',
          details?.validation_errors || [],
          technical_message
        );
        
      default:
        return new APIError(
          message || 'An unexpected error occurred.',
          code || 'UNKNOWN_ERROR',
          details,
          technical_message
        );
    }
  }
  
  // Legacy error handling for old format or non-structured errors
  switch (error.response.status) {
    case 400:
      return new APIError(
        'The submitted information was invalid. Please check your inputs and try again.',
        'BAD_REQUEST',
        responseData
      );
    case 401:
      return new APIError(
        'Your session has expired. Please refresh the page and try again.',
        'UNAUTHORIZED'
      );
    case 403:
      return new APIError(
        'You do not have permission to perform this action.',
        'FORBIDDEN'
      );
    case 409:
      return new DuplicateError(
        'This request has already been submitted.',
        responseData
      );
    case 422:
      return new ValidationError(
        'Validation failed. Please check your information.',
        responseData?.detail || []
      );
    case 429:
      return new APIError(
        'Too many requests. Please wait a moment and try again.',
        'RATE_LIMITED'
      );
    case 500:
      return new APIError(
        'An unexpected server error occurred. Our team has been notified.',
        'INTERNAL_SERVER_ERROR'
      );
    case 502:
      return new APIError(
        'Service temporarily unavailable. Please try again later.',
        'BAD_GATEWAY'
      );
    default:
      return new APIError(
        'An unexpected error occurred. Please try again.',
        'UNKNOWN_ERROR'
      );
  }
};

/**
 * Format validation errors for display
 */
export const formatValidationErrors = (validationErrors) => {
  if (!Array.isArray(validationErrors)) return '';
  
  return validationErrors
    .map(error => {
      const fieldName = extractFieldName(error.field);
      return `${fieldName}: ${error.message}`;
    })
    .join('\n');
};

/**
 * Get field-specific validation errors for form display
 */
export const getFieldValidationErrors = (validationErrors) => {
  if (!Array.isArray(validationErrors)) return {};
  
  const fieldErrors = {};
  
  validationErrors.forEach(error => {
    if (error.field) {
      // Extract the actual field name from nested paths
      const parts = error.field.split(' -> ');
      const fieldName = parts[parts.length - 1];
      
      // Map to frontend field names
      const mappedField = mapAPIFieldToFormField(fieldName);
      if (mappedField) {
        fieldErrors[mappedField] = error.message;
      }
    }
  });
  
  return fieldErrors;
};

/**
 * Map API field names to frontend form field names
 */
const mapAPIFieldToFormField = (apiField) => {
  const mapping = {
    'first_name': 'first_name',
    'last_name': 'last_name',
    'email': 'email',
    'contact_number': 'contact_number',
    'id_number': 'id_number',
    'quote_id': 'quote_id',
    'agent_email': 'agent_email',
    'branch_name': 'branch_name'
  };
  
  return mapping[apiField] || apiField;
};

/**
 * Format duplicate error message with details
 */
export const formatDuplicateError = (details) => {
  if (!details) return 'This request has already been submitted.';
  
  let message = 'This person has already submitted a transfer request';
  
  if (details.submission_date) {
    const date = new Date(details.submission_date).toLocaleDateString();
    message += ` on ${date}`;
  }
  
  if (details.matched_field) {
    message += ` (matched by ${details.matched_field.toLowerCase()})`;
  }
  
  message += '.';
  
  if (details.source === 'pineapple') {
    message += ' This lead is still active in the Pineapple system.';
  }
  
  return message;
};

/**
 * Determine recommended action based on error type
 */
export const getErrorAction = (error) => {
  if (!error.code) return null;
  
  switch (error.code) {
    case 'VALIDATION_ERROR':
    case 'QUOTE_VALIDATION_ERROR':
      return {
        type: 'fix',
        message: 'Please correct the highlighted fields and try again.',
        button: null
      };
      
    case 'TRANSFER_DUPLICATE':
      return {
        type: 'info',
        message: 'No action needed - the transfer has already been completed.',
        button: null
      };
      
    case 'QUOTE_API_ERROR':
    case 'TRANSFER_API_ERROR':
    case 'QUOTE_STORAGE_ERROR':
    case 'TRANSFER_STORAGE_ERROR':
      return {
        type: 'retry',
        message: 'This appears to be a temporary issue.',
        button: 'Retry'
      };
      
    case 'NETWORK_ERROR':
      return {
        type: 'retry',
        message: 'Please check your internet connection.',
        button: 'Retry'
      };
      
    case 'RATE_LIMITED':
      return {
        type: 'wait',
        message: 'Please wait a moment before trying again.',
        button: null
      };
      
    default:
      return {
        type: 'retry',
        message: 'Please try again.',
        button: 'Retry'
      };
  }
};
