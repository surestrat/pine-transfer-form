import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
	Check,
	AlertCircle,
	Loader2,
	User,
	Mail,
	Phone,
	FileText,
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
	{ value: "Durban-Alfred", label: "Durban-Alfred" },
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

	const {
		customer_info,
		agent_info,
		updateField,
		updateAgentInfo,
		errors,
		validateForm,
		setApiResponse,
	} = useFormStore();

	const handleChange = (e) => {
		const { name, value } = e.target;
		updateField(name, value);
	};

	const handleAgentChange = (e) => {
		const { name, value } = e.target;
		updateAgentInfo(name, value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		const isValid = validateForm();

		if (!isValid) {
			const firstErrorField = Object.keys(errors)[0];
			if (firstErrorField) {
				const inputElement = document.querySelector(
					`[name="${firstErrorField}"]`
				);
				inputElement?.focus();
			}
			return;
		}

		setIsSubmitting(true);

		try {
			// Compose payload for API
			const payload = {
				...customer_info,
				agent_name: agent_info.agent_name,
				branch_name: agent_info.branch_name,
			};

			// Log payload for debugging
			console.log("Preparing payload:", payload);

			const apiResponse = await submitForm(payload);
			console.log("Received API response:", apiResponse);

			// Store the API response in the form store
			setApiResponse(apiResponse);

			// Navigate to success page
			navigate("/success");
		} catch (err) {
			console.error("Form submission error:", err);

			// Create a user-friendly error message
			let errorMessage =
				"There was an error submitting your information. Please try again later.";

			if (err.message) {
				if (
					err.message.includes("Network Error") ||
					err.message.includes("internet")
				) {
					errorMessage = "Please check your internet connection and try again.";
				} else if (err.message.includes("timeout")) {
					errorMessage = "The request timed out. Please try again later.";
				} else if (err.message.includes("405")) {
					errorMessage =
						"Technical error: The API configuration needs to be updated. Please contact support.";
				} else {
					errorMessage = err.message;
				}
			}

			setError(errorMessage);
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
			</div>
			<motion.div
				initial={{ y: 10, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2 }}
			>
				<InputField
					label="Email Address"
					name="email"
					type="email"
					value={customer_info.email}
					onChange={handleChange}
					error={errors.email}
					required
					icon={Mail}
				/>
			</motion.div>
			<motion.div
				initial={{ y: 10, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.25 }}
			>
				<InputField
					label="ID Number"
					name="id_number"
					value={customer_info.id_number}
					onChange={handleChange}
					error={errors.id_number}
					icon={FileText}
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
							<p className="alert-message">{error}</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			{/* ... Submission Button ... */}{" "}
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
							Submitting...
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
