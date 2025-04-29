import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react"; // Using ShieldCheck for a more secure feel

const Logo = ({ size = 28 }) => {
	// Slightly larger default size
	return (
		<motion.div
			className="flex items-center cursor-pointer" // Added cursor-pointer
			whileHover={{ scale: 1.03 }} // Slightly reduced hover scale
			transition={{ type: "spring", stiffness: 300 }}
		>
			<div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-[#161b24] p-2.5 mr-3 shadow-medium">
				{" "}
				{/* Keep logo icon background vibrant */}
				<ShieldCheck size={size} className="text-white" />
			</div>
			<span className="font-bold text-2xl text-gray-100 tracking-tight">
				{" "}
				{/* Lighter text */}
				SureStrat
			</span>{" "}
		</motion.div>
	);
};

export default Logo;
