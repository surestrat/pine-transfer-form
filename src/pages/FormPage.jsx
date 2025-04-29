import React from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
// Updated import path to use alias for component within src
import LeadForm from "@forms/LeadForm.jsx"; // Use the new alias
import Logo from "@components/ui/Logo"; // Use alias for consistency

const FormPage = () => {
	return (
		<div className="relative">
			<motion.div
				className="mb-10 flex items-center justify-between" // Increased margin-bottom
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.1, ease: "easeOut" }}
			>
				<Logo size={32} />
				<div className="flex items-center text-sm text-gray-400">
					{" "}
					{/* Muted light text */}
					<Lock size={14} className="mr-1.5 text-gray-500" />{" "}
					{/* Darker muted icon */}
					<span>Secure Connection</span>
				</div>
			</motion.div>

			<motion.div
				className="mb-8 text-center" // Centered text
				initial={{ y: -10, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2, ease: "easeOut" }}
			>
				<h1 className="text-3xl sm:text-4xl font-bold text-gray-300 mb-3">
					{" "}
					{/* Light heading */}
					Pineapple Customer Information Transfer
				</h1>
				<p className="text-gray-300 max-w-xl mx-auto">
					{" "}
					{/* Standard light text */}
					Please fill out the secure form below to transfer the customer details
					accurately.
				</p>
			</motion.div>

			<motion.div
				className="bg-gray-800 rounded-2xl shadow-card p-8 sm:p-10" // Dark card background
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.3, ease: "easeOut" }}
			>
				<LeadForm />
			</motion.div>
		</div>
	);
};

export default FormPage;
