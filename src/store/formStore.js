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
	agent: z.string().min(2, "Agent name must be at least 2 characters"),
	branch: z.string().min(2, "Office name must be at least 2 characters"),
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
	agent: "",
	branch: "",
};

export const useFormStore = create((set, get) => ({
	formData: initialFormData,
	agentInfo: initialAgentInfo,
	errors: {},
	apiResponse: null,
	redirectUrl: null, // Add redirectUrl state to store the URL separately

	updateField: (field, value) => {
		set((state) => {
			const updatedFormData = { ...state.formData, [field]: value };

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
				formData: updatedFormData,
				errors: updatedErrors,
			};
		});
	},

	updateAgentInfo: (field, value) => {
		set((state) => {
			const updatedAgentInfo = { ...state.agentInfo, [field]: value };

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
				agentInfo: updatedAgentInfo,
				errors: updatedErrors,
			};
		});
	},

	validateForm: () => {
		const { formData, agentInfo } = get();
		const updatedErrors = {};
		let isValid = true;

		try {
			formSchema.parse(formData);
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
			agentSchema.parse(agentInfo);
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
		// Extract and set redirect URL from the response structure
		let redirectUrl = null;

		// Try to handle different response formats
		if (response) {
			// Option 1: Direct redirect_url property
			if (response.redirect_url) {
				redirectUrl = response.redirect_url;
			}
			// Option 2: Nested in data object
			else if (response.data && response.data.redirect_url) {
				redirectUrl = response.data.redirect_url;
			}
			// Option 3: Nested in api_response.data
			else if (
				response.api_response &&
				response.api_response.data &&
				response.api_response.data.redirect_url
			) {
				redirectUrl = response.api_response.data.redirect_url;
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
			formData: initialFormData,
			agentInfo: initialAgentInfo,
			errors: {},
			apiResponse: null,
			redirectUrl: null, // Also reset redirect URL
		});
	},
}));
