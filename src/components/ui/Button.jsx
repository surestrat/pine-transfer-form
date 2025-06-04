import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "@styles/Button.css"; // Import the CSS file

export const Button = ({
	children,
	variant = "primary",
	type = "button",
	onClick,
	disabled = false,
	className = "",
}) => {
	const [isOldBrowser, setIsOldBrowser] = useState(false);

	// Check if we're in an older browser environment
	useEffect(() => {
		// Simple detection - in real implementation, use more robust checks
		const isIE = !!document.documentMode; // Internet Explorer
		const isOldChrome =
			window.navigator.userAgent.indexOf("Chrome") > -1 &&
			// Try to detect Chrome on Windows 7 or older Chrome versions
			(window.navigator.userAgent.indexOf("Windows NT 6.1") > -1 ||
				(window.navigator.userAgent.match(/Chrome\/(\d+)/) &&
					parseInt(window.navigator.userAgent.match(/Chrome\/(\d+)/)[1]) < 50));

		setIsOldBrowser(isIE || isOldChrome);
	}, []);

	// Build class names based on props
	const buttonClasses = [
		"button",
		`button-${variant}`,
		disabled ? "button-disabled" : "",
		className,
	]
		.filter(Boolean)
		.join(" ");

	// For older browsers, render a regular button without animations
	if (isOldBrowser) {
		return (
			<button
				type={type}
				onClick={onClick}
				disabled={disabled}
				className={buttonClasses}
			>
				{children}
			</button>
		);
	}

	// For modern browsers, use motion animations
	return (
		<motion.button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={buttonClasses}
			whileHover={disabled ? {} : { scale: 1.03, y: -1 }} // Subtle lift on hover
			whileTap={disabled ? {} : { scale: 0.98 }}
			transition={{ type: "spring", stiffness: 400, damping: 15 }} // Spring animation
		>
			{children}
		</motion.button>
	);
};
