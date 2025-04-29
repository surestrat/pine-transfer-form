// Import necessary appwrite SDK components
import { Client, Databases } from "appwrite";

// Initialize the Appwrite client
const client = new Client();

// Set up the client with your Appwrite endpoint and project ID
client
	.setEndpoint(import.meta.env.VITE_APPWRITE_API_URL) // Replace with your Appwrite endpoint
	.setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Replace with your Appwrite project ID

// Initialize the database service
const databases = new Databases(client);

/**
 * Saves lead data to Appwrite database
 * @param {Object} data - Lead data including customer and agent information
 * @returns {Promise} - Promise resolving to the created document
 */
export const saveToAppwrite = async (data) => {
	try {
		// Replace with your actual database and collection IDs
		const databaseId = import.meta.env.VITE_APPWRITE_DB_ID;
		const collectionId = import.meta.env.VITE_APPWRITE_COL_ID;

		// Create a document with the provided data
		const response = await databases.createDocument(
			databaseId,
			collectionId,
			"unique()", // Generates a unique ID
			data
		);

		return response;
	} catch (error) {
		console.error("Error saving to Appwrite:", error);
		// We don't throw this error as it shouldn't block the external API call
		// Just log it instead
	}
};
