import { create } from "zustand";
import { z } from "zod";

const formSchema = z.object({
	first_name: z.string().min(2, "First name must be at least 2 characters"),
	last_name: z.string().min(2, "Last name must be at least 2 characters"),
	email: z.string().email("Invalid email address").optional().transform(e => e || undefined),
	id_number: z.string().min(13, "ID number must be at least 13 characters").optional().transform(e => e || undefined),
	quote_id: z.string().optional().transform(e => e || undefined),
	contact_number: z.string().min(10, "Contact number must be at least 10 digits"),
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
				// For optional fields, convert empty string to undefined
				const valueToValidate =
					(field === "email" || field === "id_number" || field === "quote_id") && value === ""
						? undefined
						: value;

				formSchema.shape[field].parse(valueToValidate);
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

		// Sanitize the customer info by converting empty strings to undefined
		const sanitizedCustomerInfo = {
			...customer_info,
			email: customer_info.email?.trim() || undefined,
			id_number: customer_info.id_number?.trim() || undefined,
			quote_id: customer_info.quote_id?.trim() || undefined,
		};

		try {
			formSchema.parse(sanitizedCustomerInfo);
		} catch (error) {
			if (error instanceof z.ZodError) {
				error.errors.forEach((err) => {
					if (err.path[0]) {
						// Don't add errors for optional fields that are undefined or empty
						if (!(
							(err.path[0] === 'email' || err.path[0] === 'id_number' || err.path[0] === 'quote_id') &&
							!sanitizedCustomerInfo[err.path[0]]
						)) {
							updatedErrors[err.path[0]] = err.message;
						}
					}
				});
				isValid = Object.keys(updatedErrors).length === 0;
			}
		}

		try {
			agentSchema.parse(agent_info);
		} catch (error) {
			if (error instanceof z.ZodError) {
				error.errors.forEach((err) => {
					if (err.path[0]) {
						updatedErrors[err.path[0]] = err.message;
					}
				});
				isValid = false;
			}
		}

		set({ errors: updatedErrors });
		return isValid;
	},

	setApiResponse: (response) => {
		// Clean up empty optional fields before submission
		const cleanedCustomerInfo = { ...get().customer_info };
		
		// Remove empty optional fields
		if (!cleanedCustomerInfo.email) delete cleanedCustomerInfo.email;
		if (!cleanedCustomerInfo.id_number) delete cleanedCustomerInfo.id_number;
		if (!cleanedCustomerInfo.quote_id) delete cleanedCustomerInfo.quote_id;

		// Update the store with cleaned data
		set(state => ({
			...state,
			customer_info: cleanedCustomerInfo
		}));

		// Extract redirect URL from the response
		let redirectUrl = null;

		if (response) {
			if (response.redirect_url) {
				redirectUrl = response.redirect_url;
			} else if (response.api_response && typeof response.api_response === "object") {
				if (response.api_response.data && response.api_response.data.redirect_url) {
					redirectUrl = response.api_response.data.redirect_url;
				} else if (typeof response.api_response === "string") {
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
