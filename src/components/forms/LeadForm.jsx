import '@styles/LeadForm.css';

import React, {
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import {
  AlertCircle,
  Check,
  FileText,
  Loader2,
  Mail,
  Phone,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import ErrorBoundary from '@components/ErrorBoundary';
import { Button } from '@components/ui/Button';
import ConfirmationDialog from '@components/ui/ConfirmationDialog';
import { InputField } from '@components/ui/InputField';
import { submitForm } from '@services/apiService';
import { useFormStore } from '@store/formStore';
import {
  formatDuplicateError,
  getErrorAction,
  getFieldValidationErrors,
} from '@utils/errorHandler';

const branchOptions = [
	{ value: "", label: "Select Office..." },
	{ value: "Lenasia-HeadOffice", label: "Lenasia HeadOffice" },
	{ value: "Lenasia-Riaad", label: "Lenasia Riaad" },
	{ value: "Lenasia-Ziyaad", label: "Lenasia Ziyaad" },
	{ value: "Lenasia-Tariq", label: "Lenasia Tariq" },
	{ value: "Rosebank-Irshad", label: "Rosebank Irshad" },
	{ value: "Vereeniging-Nur", label: "Vereeniging Nur" },
	{ value: "KZN-Owen", label: "KZN Owen" },
	{ value: "KZN-Leon", label: "KZN Leon" },
	{ value: "East-Rand-Johan", label: "East-Rand Johan" },
	{ value: "Pretoria-Tanya", label: "Pretoria Tanya" },
	{ value: "Rivonia-dean", label: "Rivonia Dean" },
	{ value: "Cape-Town-Nur", label: "Cape-Town Nur" },

	// Remove the empty object
	// Add more branches as needed
];

const LeadForm = () => {
		const firstNameId = useId();
		const lastNameId = useId();
		const emailId = useId();
		const idNumberId = useId();
		const contactNumberId = useId();
		const agentEmailId = useId();
		const branchNameId = useId();
		const quoteIdId = useId();
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const [retryAttempts, setRetryAttempts] = useState(0);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [pendingSubmission, setPendingSubmission] = useState(null);
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
		console.log("[LeadForm] Formatting error:", err);
		
		// Handle structured API errors
		if (err?.name) {
			switch (err.name) {
				case 'ValidationError': {
					// Extract field-specific validation errors
					const fieldErrors = getFieldValidationErrors(err.validationErrors || []);
					
					// Update form store with field-specific errors
					Object.entries(fieldErrors).forEach(([field, message]) => {
						// You may need to update the form store to handle API validation errors
						console.log(`[LeadForm] Field error: ${field} - ${message}`);
					});
					
					// Return general validation message
					return {
						message: err.message || 'Please check the provided data and try again.',
						type: 'validation',
						fieldErrors: fieldErrors
					};
				}
					
				case 'DuplicateError': {
					const duplicateMessage = formatDuplicateError(err.details);
					return {
						message: duplicateMessage,
						type: 'duplicate',
						action: 'No action needed - transfer already completed'
					};
				}
					
				case 'NetworkError':
					return {
						message: err.message,
						type: 'network',
						action: 'Retry',
						handler: handleRetry
					};
					
				case 'APIError': {
					const errorAction = getErrorAction(err);
					return {
						message: err.message,
						type: 'api',
						action: errorAction?.button,
						handler: errorAction?.button === 'Retry' ? handleRetry : null,
						recommendation: errorAction?.message
					};
				}
					
				default:
					break;
			}
		}

		// Legacy error handling
		// If Zod validation error
		if (err?.errors && Array.isArray(err.errors)) {
			return {
				message: err.errors
					.map((detail) => {
						const field = detail.path?.[detail.path.length - 1];
						const fieldLabel =
							{
								first_name: "First Name",
								last_name: "Last Name",
								email: "Email Address",
								contact_number: "Contact Number",
								id_number: "ID Number",
								quote_id: "Quote ID",
								agent_email: "Agent Email",
								branch_name: "Office",
							}[field] || field;
						return `${fieldLabel}: ${detail.message}`;
					})
					.join("\n"),
				type: 'validation'
			};
		}

		// Network error (axios or fetch)
		if (err?.isAxiosError) {
			return {
				message: err.message,
				type: 'network',
				action: "Retry",
				handler: handleRetry,
			};
		}

		// API error with status
		if (err && typeof err.status === "number") {
			switch (err.status) {
				case 429:
					submitTimeoutRef.current = setTimeout(() => {
						setError(null);
					}, 5000);
					return {
						message: "Too many attempts. Please wait a moment.",
						type: 'rate_limit'
					};
				case 500:
					return {
						message: err.message,
						type: 'server_error',
						action: "Start Over",
						handler: handleFormReset,
					};
				default:
					return {
						message: err.message,
						type: 'api'
					};
			}
		}

		// Fallback
		return {
			message: err?.message || "An unexpected error occurred. Please try again.",
			type: 'unknown'
		};
	};

	const handleSubmit = async (e) => {
		if (e) {
			e.preventDefault();
		}
		setError(null);

		console.log("[LeadForm] Submitting form...");
		console.log("[LeadForm] customer_info:", customer_info);
		console.log("[LeadForm] agent_info:", agent_info);

		const isValid = validateForm();
		console.log("[LeadForm] validateForm result:", isValid, errors);
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
								id_number: "ID Number",
								quote_id: "Quote ID",
								agent_email: "Agent Email",
								branch_name: "Office",
							}[field] || field;
						return `${fieldLabel}: ${message}`;
					})
					.join("\n");
				setError(errorMessages);
				console.warn("[LeadForm] Validation failed:", errorMessages);
			}
			return;
		}

		// Check if quote_id is missing and show confirmation dialog
		const hasQuoteId = customer_info.quote_id && customer_info.quote_id.trim().length > 0;
		if (!hasQuoteId) {
			// Store the submission data for later use
			setPendingSubmission({
				customer_info,
				agent_info
			});
			setShowConfirmDialog(true);
			return;
		}

		// Proceed with submission if quote_id exists or user confirmed
		await processSubmission();
	};

	const processSubmission = async () => {
		setIsSubmitting(true);
		try {
			// Use current form state or pending submission data
			const currentCustomerInfo = pendingSubmission?.customer_info || customer_info;
			const currentAgentInfo = pendingSubmission?.agent_info || agent_info;

			// Start with only required fields
			const customerInfo = {
				first_name: currentCustomerInfo.first_name,
				last_name: currentCustomerInfo.last_name,
				contact_number: currentCustomerInfo.contact_number,
			};

			// Add optional fields only if they exist and have content
			if (currentCustomerInfo.quote_id) {
				const trimmedQuoteId = currentCustomerInfo.quote_id.trim();
				if (trimmedQuoteId.length > 0) customerInfo.quote_id = trimmedQuoteId;
			}

			// Email is required
			customerInfo.email = currentCustomerInfo.email.trim();

			if (currentCustomerInfo.id_number) {
				const trimmedIdNumber = currentCustomerInfo.id_number.trim();
				if (trimmedIdNumber.length > 0)
					customerInfo.id_number = trimmedIdNumber;
			}

			const payload = {
				...customerInfo,
				agent_email: currentAgentInfo.agent_email,
				branch_name: currentAgentInfo.branch_name,
			};

			console.log("[LeadForm] Submitting payload to API:", payload);
			const apiResponse = await submitForm(payload);
			console.log("[LeadForm] API response:", apiResponse);

			setApiResponse(apiResponse);
			navigate("/success");
		} catch (err) {
			console.error("[LeadForm] Submission error:", err);
			const errorInfo = formatErrorMessage(err);
			if (typeof errorInfo === "object") {
				setError(errorInfo);
			} else {
				setError({ message: errorInfo });
			}
		} finally {
			setIsSubmitting(false);
			// Clear pending submission and dialog state
			setPendingSubmission(null);
			setShowConfirmDialog(false);
		}
	};

	const handleConfirmWithoutQuote = () => {
		setShowConfirmDialog(false);
		processSubmission();
	};

	const handleCancelDialog = () => {
		setShowConfirmDialog(false);
		setPendingSubmission(null);
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
						 id={`first_name-${firstNameId}`}
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
						 id={`last_name-${lastNameId}`}
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
					 id={`email-${emailId}`}
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
					 id={`id_number-${idNumberId}`}
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
				transition={{ delay: 0.3 }}
			>
				 <InputField
					 label="Quote ID (Optional)"
					 name="quote_id"
					 id={`quote_id-${quoteIdId}`}
					 value={customer_info.quote_id || ""}
					 onChange={handleChange}
					 error={errors.quote_id}
					 icon={FileText}
					 optional={true}
					 required={false}
					 placeholder="Enter your quote reference ID"
				 />
			</motion.div>
			<motion.div
				initial={{ y: 10, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.4 }}
			>
				 <InputField
					 label="Contact Number"
					 name="contact_number"
					 id={`contact_number-${contactNumberId}`}
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
						 label="Agent Email"
						 name="agent_email"
						 id={`agent_email-${agentEmailId}`}
						 value={agent_info.agent_email}
						 onChange={handleAgentChange}
						 error={errors.agent_email}
						 required
						 icon={User}
					 />
					 <div className="agent-copy-notice">
						 <div className="notice-content">
							 <Mail size={16} className="notice-icon" />
							 <span className="notice-text">
								 The agent will receive a copy of this submission for their records.
							 </span>
						 </div>
					 </div>{" "}
					<div className="form-group">
									<label htmlFor={`branch_name-${branchNameId}`} className="form-label">
										Office <span className="required-mark">*</span>
									</label>
									<div className="select-wrapper">
										<select
											id={`branch_name-${branchNameId}`}
											name="branch_name"
											value={agent_info.branch_name}
											onChange={handleAgentChange}
											required
											className={`form-select ${errors.branch_name ? "error" : ""}`}
											aria-invalid={!!errors.branch_name}
											aria-describedby={
												errors.branch_name ? `branch-error-${branchNameId}` : undefined
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
										<p id={`branch-error-${branchNameId}`} className="error-message" role="alert">
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
						className={`alert-box ${error.type || ''}`}
						role="alert"
					>
						<div className="alert-content">
							<AlertCircle className="alert-icon" size={20} />
							<div className="alert-message-container">
								<p className="alert-message">{error.message || error}</p>
								{error.recommendation && (
									<p className="alert-recommendation">
										<small>{error.recommendation}</small>
									</p>
								)}
								{error.type === 'duplicate' && (
									<p className="alert-info">
										<small>The customer's information has already been submitted and processed.</small>
									</p>
								)}
								{error.action && error.handler && (
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
				<ErrorBoundary fallback={
					<div className="alert-box" role="alert" style={{marginTop: 16}}>
						<div className="alert-content">
							<AlertCircle className="alert-icon" size={20} />
							<div className="alert-message-container">
								<p className="alert-message">A critical error occurred with the submit button. Please refresh the page or contact support.</p>
							</div>
						</div>
					</div>
				}>
					<div className="button-group">
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
						<Button
							type="button"
							variant="secondary"
							onClick={() => navigate('/quote')}
							className="quote-button"
						>
							Get Insurance Quote
						</Button>
					</div>
				</ErrorBoundary>
			</div>

			<ConfirmationDialog
				isOpen={showConfirmDialog}
				onClose={handleCancelDialog}
				onConfirm={handleConfirmWithoutQuote}
				title="Transfer Without Quote?"
				message="You are about to transfer this lead without a Quote ID. The customer will not have access to their quote information. Are you sure you want to continue?"
				confirmText="Transfer Without Quote"
				cancelText="Add Quote ID"
				variant="warning"
			/>
		</form>
	);
};

export default LeadForm;
