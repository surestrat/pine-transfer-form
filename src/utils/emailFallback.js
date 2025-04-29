/**
 * Fallback system for email notifications
 * Used when direct email sending fails
 */

// Store unsent emails for retry
const pendingEmails = [];

/**
 * Add an email to the pending queue
 */
export const queueEmailForRetry = (emailData) => {
	emailData.queuedAt = new Date().toISOString();
	pendingEmails.push(emailData);
	console.log(`Email queued for retry. Queue length: ${pendingEmails.length}`);

	// Store in localStorage for persistence
	try {
		localStorage.setItem("pendingEmails", JSON.stringify(pendingEmails));
	} catch (e) {
		console.warn("Could not save pending emails to localStorage", e);
	}

	return pendingEmails.length;
};

/**
 * Get all pending emails
 */
export const getPendingEmails = () => {
	return [...pendingEmails];
};

/**
 * Load any saved pending emails from localStorage
 */
export const loadPendingEmails = () => {
	try {
		const saved = localStorage.getItem("pendingEmails");
		if (saved) {
			const parsed = JSON.parse(saved);
			if (Array.isArray(parsed)) {
				pendingEmails.push(...parsed);
				console.log(`Loaded ${parsed.length} pending emails from storage`);
			}
		}
	} catch (e) {
		console.warn("Could not load pending emails from localStorage", e);
	}

	return pendingEmails.length;
};

/**
 * Create a debug message with email info
 */
export const createDebugMessage = (emailData) => {
	return {
		subject: emailData.subject,
		recipients: emailData.to.split(",").length,
		timestamp: new Date().toISOString(),
		contentLength: emailData.html?.length || 0,
	};
};
