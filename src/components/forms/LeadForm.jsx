import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
	Check,
	AlertCircle,
	Loader2,
	User,
	Phone,
	FileText,
	Mail,
} from "lucide-react";
import { useFormStore } from "@store/formStore";
import { InputField } from "@components/ui/InputField";
import { Button } from "@components/ui/Button";
import { submitForm } from "@services/apiService";
import "@styles/LeadForm.css";

const branchOptions = [
	{ value: "", label: "Select Office..." },
	{ value: "Lenasia-HeadOffice", label: "Lenasia-HO" },
	{ value: "Lenasia-Riaad", label: "Lenasia-Riaad" },
	{ value: "Lenasia-Ziyaad", label: "Lenasia-Ziyaad" },
	{ value: "Lenasia-Tariq", label: "Lenasia-Tariq" },
	{ value: "Rosebank-Irshad", label: "Rosebank-Irshad" },
	{ value: "Vereeniging-Nur", label: "Vereeniging-Nur" },
	{ value: "Durban-Owen", label: "Durban-Owen" },
	{ value: "Durban-Leon", label: "Durban-Leon" },
	{ value: "East-Rand-Johan", label: "East Rand-Johan" },
	{ value: "Pretoria-Tanya", label: "Pretoria-Tanya" },
	{ value: "Rivonia-dean", label: "Rivonia-Dean" },

	// Remove the empty object
	// Add more branches as needed
];

const LeadForm = () => {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const [retryAttempts, setRetryAttempts] = useState(0);
	const maxRetries = 3;

	// Add timeout ref for cleanup
	const submitTimeoutRef = useRef(null);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (submitTimeoutRef.current) {
				clearTimeout(submitTimeoutRef.current);
			}
		};
	}, []);

	const {
		customer_info,
		agent_info,
		updateField,
		updateAgentInfo,
		errors,
		validateForm,
		setApiResponse,
		resetForm,
	} = useFormStore();

	const handleChange = (e) => {
		const { name, value } = e.target;
		updateField(name, value);
	};

	const handleAgentChange = (e) => {
		const { name, value } = e.target;
		updateAgentInfo(name, value);
	};

	const handleFormReset = () => {
		resetForm();
		setError(null);
		setRetryAttempts(0);
	};

	const handleRetry = () => {
		if (retryAttempts < maxRetries) {
			setError(null);
			setRetryAttempts((prev) => prev + 1);
			handleSubmit();
		}
	};

	const formatErrorMessage = (err) => {
		if (err instanceof ValidationError) {
			if (Array.isArray(err.details)) {
				return err.details
					.map((detail) => {
						const field = detail.loc[detail.loc.length - 1];
						const fieldLabel =
							{
								first_name: "First Name",
								last_name: "Last Name",
								email: "Email Address",
								contact_number: "Contact Number",
								agent_name: "Agent Name",
								branch_name: "Office",
							}[field] || field;
						return `${fieldLabel}: ${detail.msg}`;
					})
					.join("\n");
			}
			return err.details || "Please check your input and try again.";
		}

		if (err instanceof NetworkError) {
			return {
				message: err.message,
				action: "Retry",
				handler: handleRetry,
			};
		}

		if (err instanceof ApiError) {
			switch (err.status) {
				case 429:
					submitTimeoutRef.current = setTimeout(() => {
						setError(null);
					}, 5000);
					return "Too many attempts. Please wait a moment.";
				case 500:
					return {
						message: err.message,
						action: "Start Over",
						handler: handleFormReset,
					};
				default:
					return err.message;
			}
		}

		return "An unexpected error occurred. Please try again.";
	};

	const handleSubmit = async (e) => {
		if (e) {
			e.preventDefault();
		}
		setError(null);

		const isValid = validateForm();
		if (!isValid) {
			const firstErrorField = Object.keys(errors)[0];
			if (firstErrorField) {
				const inputElement = document.querySelector(
					`[name="${firstErrorField}"]`,
				);
				inputElement?.focus();

				// Show validation error message
				const errorMessages = Object.entries(errors)
					.map(([field, message]) => {
						const fieldLabel =
							{
								first_name: "First Name",
								last_name: "Last Name",
								email: "Email Address",
								contact_number: "Contact Number",
								agent_name: "Agent Name",
								branch_name: "Office",
							}[field] || field;
						return `${fieldLabel}: ${message}`;
					})
					.join("\n");
				setError(errorMessages);
			}
			return;
		}

		setIsSubmitting(true);
		try {
			// Start with only required fields
			const customerInfo = {
				first_name: customer_info.first_name,
				last_name: customer_info.last_name,
				contact_number: customer_info.contact_number,
			};

			// Add optional fields only if they exist and have content
			if (customer_info.quote_id) {
				const trimmedQuoteId = customer_info.quote_id.trim();
				if (trimmedQuoteId.length > 0) customerInfo.quote_id = trimmedQuoteId;
			}

			// Email is required
			customerInfo.email = customer_info.email.trim();

			if (customer_info.id_number) {
				const trimmedIdNumber = customer_info.id_number.trim();
				if (trimmedIdNumber.length > 0)
					customerInfo.id_number = trimmedIdNumber;
			}

			const payload = {
				...customerInfo,
				agent_name: agent_info.agent_name,
				branch_name: agent_info.branch_name,
			};

			const apiResponse = await submitForm(payload);

			setApiResponse(apiResponse);
			navigate("/success");
		} catch (err) {
			const errorInfo = formatErrorMessage(err);
			if (typeof errorInfo === "object") {
				setError(errorInfo);
			} else {
				setError({ message: errorInfo });
			}
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<form onSubmit={handleSubmit} className="lead-form">
			<h2 className="section-title">
				<span className="section-icon">
					<User size={18} />
				</span>
				Customer Details
			</h2>
			<div className="form-grid">
				<motion.div
					initial={{ x: -10, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ delay: 0.1 }}
				>
					<InputField
						label="First Name"
						name="first_name"
						value={customer_info.first_name}
						onChange={handleChange}
						error={errors.first_name}
						required
						icon={User}
					/>
				</motion.div>
				<motion.div
					initial={{ x: 10, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ delay: 0.15 }}
				>
					<InputField
						label="Last Name"
						name="last_name"
						value={customer_info.last_name}
						onChange={handleChange}
						error={errors.last_name}
						required
						icon={User}
					/>
				</motion.div>
			</div>{" "}
			<motion.div
				initial={{ y: 10, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2 }}
			>
				{" "}
				<InputField
					label="Email Address"
					name="email"
					type="email"
					value={customer_info.email || ""}
					onChange={handleChange}
					error={errors.email}
					icon={Mail}
					required={true}
				/>
			</motion.div>{" "}
			<motion.div
				initial={{ y: 10, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.25 }}
			>
				<InputField
					label="ID Number (Optional)"
					name="id_number"
					value={customer_info.id_number || ""}
					onChange={handleChange}
					error={errors.id_number}
					icon={FileText}
					optional={true}
					required={false}
				/>
			</motion.div>
			<motion.div
				initial={{ y: 10, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.35 }}
			>
				<InputField
					label="Contact Number"
					name="contact_number"
					type="tel"
					value={customer_info.contact_number}
					onChange={handleChange}
					error={errors.contact_number}
					required
					icon={Phone}
				/>
			</motion.div>{" "}
			<div className="divider-section">
				<h2 className="section-title">
					<span className="section-icon">
						<FileText size={18} />
					</span>
					Agent Information
				</h2>
				<div className="form-grid">
					<InputField
						label="Agent Name"
						name="agent_name"
						value={agent_info.agent_name}
						onChange={handleAgentChange}
						error={errors.agent_name}
						required
						icon={User}
					/>{" "}
					<div className="form-group">
						<label htmlFor="branch_name" className="form-label">
							Office <span className="required-mark">*</span>
						</label>
						<div className="select-wrapper">
							<select
								id="branch_name"
								name="branch_name"
								value={agent_info.branch_name}
								onChange={handleAgentChange}
								required
								className={`form-select ${errors.branch_name ? "error" : ""}`}
								aria-invalid={!!errors.branch_name}
								aria-describedby={
									errors.branch_name ? "branch-error" : undefined
								}
							>
								{branchOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>{" "}
						{errors.branch_name && (
							<p id="branch-error" className="error-message" role="alert">
								{errors.branch_name}
							</p>
						)}
					</div>
				</div>
			</div>
			{/* ... Error Message Display (Adjust colors if needed) ... */}{" "}
			<AnimatePresence>
				{error && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="alert-box"
						role="alert"
					>
						<div className="alert-content">
							<AlertCircle className="alert-icon" size={20} />
							<div className="alert-message-container">
								<p className="alert-message">{error.message || error}</p>
								{error.action && (
									<button
										type="button"
										onClick={error.handler}
										className="alert-action-button"
									>
										{error.action}
									</button>
								)}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<div className="form-footer">
				<Button
					type="submit"
					variant="primary"
					disabled={isSubmitting}
					className="submit-button"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="loading-icon" />
							{retryAttempts > 0
								? `Retrying... (${retryAttempts}/${maxRetries})`
								: "Submitting..."}
						</>
					) : (
						<>
							Submit Application
							<Check className="check-icon" />
						</>
					)}
				</Button>
			</div>
		</form>
	);
};

export default LeadForm;
