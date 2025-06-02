import { create } from "zustand";
import { z } from "zod";

const formSchema = z.object({
	first_name: z.string().min(2, "First name must be at least 2 characters"),
	last_name: z.string().min(2, "Last name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	id_number: z
		.string()
		.min(13, "ID number must be at least 13 characters")
		.optional(), // Make optional as per API docs
	quote_id: z.string().optional(), // Make optional as per API docs
	contact_number: z
		.string()
		.min(10, "Contact number must be at least 10 digits"),
});

const agentSchema = z.object({
	agent_name: z.string().min(2, "Agent name must be at least 2 characters"),
	branch_name: z.string().min(2, "Office name must be at least 2 characters"),
});

const initialFormData = {
	first_name: "",
	last_name: "",
	email: "",
	id_number: "",
	quote_id: "",
	contact_number: "",
};

const initialAgentInfo = {
	agent_name: "",
	branch_name: "",
};

export const useFormStore = create((set, get) => ({
	customer_info: initialFormData,
	agent_info: initialAgentInfo,
	errors: {},
	apiResponse: null,
	redirectUrl: null, // Add redirectUrl state to store the URL separately

	updateField: (field, value) => {
		set((state) => {
			const updatedFormData = { ...state.customer_info, [field]: value };

			const updatedErrors = { ...state.errors };

			try {
				formSchema.shape[field].parse(value);

				delete updatedErrors[field];
			} catch (error) {
				if (error instanceof z.ZodError) {
					updatedErrors[field] = error.errors[0]?.message || `Invalid ${field}`;
				}
			}

			return {
				customer_info: updatedFormData,
				errors: updatedErrors,
			};
		});
	},

	updateAgentInfo: (field, value) => {
		set((state) => {
			const updatedAgentInfo = { ...state.agent_info, [field]: value };

			const updatedErrors = { ...state.errors };

			try {
				agentSchema.shape[field].parse(value);

				delete updatedErrors[field];
			} catch (error) {
				if (error instanceof z.ZodError) {
					updatedErrors[field] = error.errors[0]?.message || `Invalid ${field}`;
				}
			}

			return {
					agent_info: updatedAgentInfo,
				errors: updatedErrors,
			};
		});
	},

	validateForm: () => {
		const { customer_info, agent_info } = get();
		const updatedErrors = {};
		let isValid = true;

		try {
			formSchema.parse(customer_info);
		} catch (error) {
			if (error instanceof z.ZodError) {
				error.errors.forEach((err) => {
					const path = err.path[0];
					if (path !== undefined) {
						updatedErrors[path] = err.message;
					}
				});
				isValid = false;
			}
		}

		try {
			agentSchema.parse(agent_info);
		} catch (error) {
			if (error instanceof z.ZodError) {
				error.errors.forEach((err) => {
					const path = err.path[0];
					if (path !== undefined) {
						updatedErrors[path] = err.message;
					}
				});
				isValid = false;
			}
		}

		set({ errors: updatedErrors });

		return isValid;
	},

	setApiResponse: (response) => {
		// Extract redirect URL from the response based on the structure returned by your FastAPI
		let redirectUrl = null;

		if (response) {
			// Direct redirect_url from your FastAPI response
			if (response.redirect_url) {
				redirectUrl = response.redirect_url;
			}
			// Nested in api_response
			else if (
				response.api_response &&
				typeof response.api_response === "object"
			) {
				// If api_response is already an object
				if (
					response.api_response.data &&
					response.api_response.data.redirect_url
				) {
					redirectUrl = response.api_response.data.redirect_url;
				}
				// If api_response is a string (JSON)
				else if (typeof response.api_response === "string") {
					try {
						const parsedResponse = JSON.parse(response.api_response);
						if (parsedResponse.data && parsedResponse.data.redirect_url) {
							redirectUrl = parsedResponse.data.redirect_url;
						}
					} catch (e) {
						console.error("Error parsing API response:", e);
					}
				}
			}
		}

		console.log("Setting redirect URL:", redirectUrl);

		set({
			apiResponse: response,
			redirectUrl: redirectUrl,
		});
	},

	resetForm: () => {
		set({
			customer_info: initialFormData,
			agent_info: initialAgentInfo,
			errors: {},
			apiResponse: null,
			redirectUrl: null, // Also reset redirect URL
		});
	},
}));
