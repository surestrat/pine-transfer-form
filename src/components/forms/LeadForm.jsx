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
import { submitLead } from "@services/apiService";
import { submitLeadViaProxy } from "@services/proxyApiService";
import { saveToAppwrite } from "@services/appwriteService";

import { ID } from "appwrite";

const branchOptions = [
	{ value: "", label: "Select Office..." },
	{ value: "Lenasia-HO", label: "Lenasia-HO" },
	{ value: "Lenasia-Moe", label: "Lenasia-Moe" },
	{ value: "Lenasia-Ziyaad", label: "Lenasia-Ziyaad" },
	{ value: "Lenasia-Tariq", label: "Lenasia-Tariq" },
	{ value: "Rosebank-Irshad", label: "Rosebank-Irshad" },
	{ value: "Vereeniging-Ahmed", label: "Vereeniging-Ahmed" },
	{},
	// Add more branches as needed
];

const LeadForm = () => {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	const {
		formData,
		agentInfo,
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
			// Generate a unique quote ID
			const generatedQuoteId = ID.unique();

			// Format data for API submission
			const apiPayload = {
				source: "SureStrat",
				first_name: formData.first_name,
				last_name: formData.last_name,
				email: formData.email,
				id_number: formData.id_number,
				quote_id: generatedQuoteId,
				contact_number: formData.contact_number,
				additionalProp1: {},
			};

			// Use proxy in development, direct in production
			let apiResponse;
			if (import.meta.env.DEV) {
				// Use proxy in development
				apiResponse = await submitLeadViaProxy(apiPayload);
				console.log("API response via proxy:", apiResponse);
			} else {
				// Direct API call in production
				apiResponse = await submitLead(apiPayload);
				console.log("API response direct:", apiResponse);
			}

			// Save the API response in the store
			setApiResponse(apiResponse);

			// Log agent info before saving to help with debugging
			console.log("Agent info before saving:", {
				agent: agentInfo.agent,
				branch: agentInfo.branch,
			});

			// Extract uuid as pine_client_id and redirect_url as url from the API response
			const pine_client_id = apiResponse?.data?.uuid || "";
			const url = apiResponse?.data?.redirect_url || "";

			console.log("Extracted from API response:", {
				pine_client_id,
				originalUrl: apiResponse?.data?.redirect_url,
				transformedUrl: url,
			});

			// Save to Appwrite with agent info and the extracted fields including transformed URL
			await saveToAppwrite({
				...formData,
				agent: agentInfo.agent,
				branch: agentInfo.branch,
				quote_id: generatedQuoteId, // Use generated quote ID
				pine_client_id, // Add the uuid as pine_client_id
				url, // Use the original redirect_url as url
			});

			try {
				await sendNotificationEmails(formData, agentInfo, pine_client_id, url);
				console.log("Email notification sent successfully");
			} catch (emailError) {
				console.error("Failed to send email notification:", emailError);
			}

			// Navigate to success page without resetting form yet
			navigate("/success");
		} catch (err) {
			console.error("Submission error:", err);
			setError(
				err.message ||
					"There was an error submitting your information. Please check your details and try again."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<h2 className="text-xl font-semibold text-gray-200 border-b border-gray-600 pb-2 mb-6">
				{/* Lighter heading, darker border */}
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
						value={formData.first_name}
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
						value={formData.last_name}
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
					value={formData.email}
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
					value={formData.id_number}
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
					value={formData.contact_number}
					onChange={handleChange}
					error={errors.contact_number}
					required
					icon={Phone}
				/>
			</motion.div>
			<div className="pt-8 mt-8 border-t border-gray-700">
				{/* Darker top border */}
				<h2 className="text-xl font-semibold text-gray-200 border-b border-gray-600 pb-2 mb-6">
					{/* Lighter heading, darker border */}
					Agent Information
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
					<InputField
						label="Agent Name"
						name="agent"
						value={agentInfo.agent}
						onChange={handleAgentChange}
						error={errors.agent}
						required
						icon={User}
					/>
					<div className="mb-5">
						<label
							htmlFor="branch"
							className="block text-sm font-medium text-gray-300 mb-1.5"
						>
							Office <span className="text-red-400">*</span>
						</label>
						<div className="relative">
							<select
								id="branch"
								name="branch"
								value={agentInfo.branch}
								onChange={handleAgentChange}
								required
								className={`
									w-full pr-6 pl-4 pr-10 py-3 rounded-xl border
									bg-gray-700 focus:bg-gray-600
									focus:outline-none focus:ring-2 focus:ring-opacity-75
									text-gray-100 placeholder-gray-400
									${
										errors.branch
											? "border-red-500 ring-red-400"
											: "border-gray-600 hover:border-gray-500"
									}
									disabled:bg-gray-800 disabled:cursor-not-allowed disabled:border-gray-700 disabled:opacity-60
								`}
								aria-invalid={!!errors.branch}
								aria-describedby={errors.branch ? "branch-error" : undefined}
							>
								{branchOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>
						{errors.branch && (
							<p
								id="branch-error"
								className="mt-1.5 text-xs text-red-400"
								role="alert"
							>
								{errors.branch}
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
						className="bg-red-900 bg-opacity-30 border border-red-500 border-opacity-50 p-4 rounded-xl mt-6" // Darker error background/border
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
					className="w-full sm:w-auto min-w-[180px] bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 rounded-lg shadow-sm transition duration-200 ease-in-out flex items-center justify-center"
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
