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
			<div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 p-2.5 mr-3 shadow-lg ring-4 ring-teal-500/10 border border-teal-400/30">
				<ShieldCheck size={size} className="text-white drop-shadow-md" />
			</div>
			<div className="flex flex-col">
				<span className="font-bold text-2xl text-white tracking-tight">
					SureStrat
				</span>
				<span className="text-xs text-teal-400 -mt-1 tracking-wide">
					TRANSFER PORTAL
				</span>
			</div>
		</motion.div>
	);
};

export default Logo;
