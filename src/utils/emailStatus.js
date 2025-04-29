/**
 * Simple module to track email sending status
 */
let lastEmailStatus = {
	timestamp: null,
	success: false,
	recipients: [],
	errors: [],
};

/**
 * Updates the status of the last email sending attempt
 * @param {Object} status - Email sending status details
 */
export const updateEmailStatus = (status) => {
	lastEmailStatus = {
		...status,
		timestamp: new Date(),
	};
};

/**
 * Gets the latest email sending status
 * @returns {Object} The last email status information
 */
export const getLastEmailStatus = () => {
	return { ...lastEmailStatus };
};

/**
 * Checks if any emails were sent successfully in the last attempt
 * @returns {boolean} True if at least one email was sent successfully
 */
export const wasLastEmailSuccessful = () => {
	return lastEmailStatus.success;
};
