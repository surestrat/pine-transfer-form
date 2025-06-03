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

const branchOptions = [
	{ value: "", label: "Select Office..." },
	{ value: "Lenasia-HO", label: "Lenasia-HO" },
	{ value: "Lenasia-Moe", label: "Lenasia-Moe" },
	{ value: "Lenasia-Ziyaad", label: "Lenasia-Ziyaad" },
	{ value: "Lenasia-Tariq", label: "Lenasia-Tariq" },
	{ value: "Rosebank-Irshad", label: "Rosebank-Irshad" },
	{ value: "Vereeniging-Ahmed", label: "Vereeniging-Ahmed" },
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
		<form onSubmit={handleSubmit} className="space-y-5">
			<h2 className="text-xl font-semibold text-gray-100 border-b border-[#2a3142] pb-2 mb-6 flex items-center">
				<span className="bg-teal-500/10 text-teal-400 p-1.5 rounded-lg mr-2">
					<User size={18} />
				</span>
				Customer Details
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
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
			</motion.div>
			<div className="pt-8 mt-8 border-t border-gray-700">
				{/* Darker top border */}
				<h2 className="text-xl font-semibold text-gray-100 border-b border-[#2a3142] pb-2 mb-6 flex items-center">
					<span className="bg-teal-500/10 text-teal-400 p-1.5 rounded-lg mr-2">
						<FileText size={18} />
					</span>
					Agent Information
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
					<InputField
						label="Agent Name"
						name="agent_name"
						value={agent_info.agent_name}
						onChange={handleAgentChange}
						error={errors.agent_name}
						required
						icon={User}
					/>
					<div className="mb-5">
						<label
							htmlFor="branch_name"
							className="block text-sm font-medium text-gray-300 mb-1.5"
						>
							Office <span className="text-red-400">*</span>
						</label>
						<div className="relative">
							<select
								id="branch_name"
								name="branch_name"
								value={agent_info.branch_name}
								onChange={handleAgentChange}
								required
								className={`
										w-full pr-6 pl-4 py-3 rounded-xl border shadow-inner
										bg-[#131620] focus:bg-[#1c2130]
										focus:outline-none focus:ring-2 focus:ring-opacity-75
										text-gray-100 placeholder-gray-500
										${
											errors.branch_name
												? "border-red-500/70 ring-red-500/20"
												: "border-[#2a3142] hover:border-[#3a4154] focus:border-teal-500 focus:ring-teal-500/20"
										}
										disabled:bg-[#0f1219] disabled:cursor-not-allowed disabled:border-[#20253a] disabled:opacity-60
									`}
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
						</div>
						{errors.branch_name && (
							<p
								id="branch-error"
								className="mt-1.5 text-xs text-red-400"
								role="alert"
							>
								{errors.branch_name}
							</p>
						)}
					</div>
				</div>
			</div>
			{/* ... Error Message Display (Adjust colors if needed) ... */}
			<AnimatePresence>
				{error && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl mt-6 shadow-inner"
						role="alert"
					>
						<div className="flex items-start">
							<AlertCircle
								className="text-red-400 mr-3 flex-shrink-0 mt-0.5" // Lighter red icon
								size={20}
							/>
							<p className="text-sm text-red-300">{error}</p>{" "}
							{/* Lighter red text */}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			{/* ... Submission Button ... */}
			<div className="flex justify-end pt-6">
				<Button
					type="submit"
					variant="primary"
					disabled={isSubmitting}
					className="w-full sm:w-auto min-w-[180px]"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="mr-2 h-5 w-5 animate-spin" />
							Submitting...
						</>
					) : (
						<>
							Submit Application
							<Check className="ml-2 h-5 w-5" />
						</>
					)}
				</Button>
			</div>
		</form>
	);
};

export default LeadForm;
