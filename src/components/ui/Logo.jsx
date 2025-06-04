import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react"; // Using ShieldCheck for a more secure feel
import "@styles/Logo.css"; // Import the CSS file

const Logo = ({ size = 28 }) => {
	// Slightly larger default size
	return (
		<motion.div
			className="logo-container"
			whileHover={{ scale: 1.03 }} // Slightly reduced hover scale
			transition={{ type: "spring", stiffness: 300 }}
		>
			<div className="logo-icon-wrapper">
				<ShieldCheck size={size} className="logo-icon logo-shield" />
			</div>
			<div className="logo-text-container">
				<span className="logo-title">SureStrat</span>
				<span className="logo-subtitle">TRANSFER PORTAL</span>
			</div>
		</motion.div>
	);
};

export default Logo;
