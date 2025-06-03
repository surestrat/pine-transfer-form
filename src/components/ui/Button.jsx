import React from "react";
import { motion } from "framer-motion";

export const Button = ({
	children,
	variant = "primary",
	type = "button",
	onClick,
	disabled = false,
	className = "",
}) => {
	const baseStyles =
		"inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-base tracking-tight transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-medium hover:shadow-lg"; // Added dark ring offset

	const variantStyles = {
		primary:
			"bg-teal-600 hover:bg-teal-500 text-white focus:ring-teal-400 border border-teal-500/30", // Teal primary button
		secondary:
			"bg-gradient-to-r from-[#131620] to-[#1c2130] hover:from-[#1c2130] hover:to-[#252b3d] text-white border border-[#2a3142] focus:ring-[#2a3142]", // Modern dark gradient
		outline:
			"border border-teal-500/50 bg-transparent hover:bg-teal-500/10 text-teal-300 focus:ring-teal-400/30 shadow-soft hover:shadow-medium", // Teal outline
	};

	const disabledStyles =
		"opacity-50 cursor-not-allowed shadow-none hover:shadow-none";

	return (
		<motion.button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${disabled ? disabledStyles : ""}
        ${className}
      `}
			whileHover={disabled ? {} : { scale: 1.03, y: -1 }} // Subtle lift on hover
			whileTap={disabled ? {} : { scale: 0.98 }}
			transition={{ type: "spring", stiffness: 400, damping: 15 }} // Spring animation
		>
			{children}
		</motion.button>
	);
};
