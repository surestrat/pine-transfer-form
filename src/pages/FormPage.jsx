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
				<div className="flex items-center text-sm text-teal-400 bg-[#131620]/70 backdrop-blur-sm px-3.5 py-2 rounded-full border border-teal-500/20 shadow-inner">
					<Lock size={14} className="mr-2 text-teal-500" />
					<span className="font-medium tracking-tight">Secure Connection</span>
				</div>
			</motion.div>

			<motion.div
				className="mb-8 text-center" // Centered text
				initial={{ y: -10, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2, ease: "easeOut" }}
			>
				<h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
					{" "}
					<span className="text-teal-400">Pineapple</span> Customer Information
					Transfer
				</h1>
				<p className="text-gray-400 max-w-xl mx-auto">
					{" "}
					Please fill out the secure form below to transfer the customer details
					accurately and quickly.
				</p>
			</motion.div>

			<motion.div
				className="bg-[#131620] rounded-2xl shadow-xl p-8 sm:p-10 border border-[#2a3142] backdrop-blur-sm" // Modern dark card with border and blur effect
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
