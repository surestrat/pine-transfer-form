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
			"bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-400", // Keep primary as is
		secondary:
			"bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white focus:ring-secondary-400", // Keep secondary as is
		outline:
			"border border-primary-500 bg-transparent hover:bg-primary-500 hover:bg-opacity-10 text-primary-300 focus:ring-primary-400 shadow-soft hover:shadow-medium", // Adjusted for dark: transparent bg, light text, subtle hover
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
