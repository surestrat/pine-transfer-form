import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Check } from "lucide-react";

export const InputField = ({
	label,
	name,
	value,
	onChange,
	error,
	type = "text",
	required = false,
	pattern,
	placeholder,
	icon: Icon, // Add icon prop
}) => {
	const [focused, setFocused] = useState(false);
	const [touched, setTouched] = useState(false);

	const isValid = touched && value && !error;

	const handleBlur = (e) => {
		if (onChange) {
			onChange(e);
		}
		setFocused(false);
		setTouched(true);
	};

	const hasIcon = !!Icon;

	return (
		<div className="relative mb-5">
			<label
				htmlFor={name}
				className="block text-sm font-medium text-gray-300 mb-1.5" // Lighter label text
			>
				{label} {required && <span className="text-red-400">*</span>}{" "}
				{/* Lighter required star */}
			</label>
			<div className="relative">
				{/* Icon positioned absolutely on the left */}
				{hasIcon && (
					<div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
						<Icon
							className={`h-5 w-5 ${
								focused ? "text-primary-400" : "text-gray-500" // Lighter primary focus, darker gray default
							}`}
						/>
					</div>
				)}
				<motion.input
					id={name}
					name={name}
					type={type}
					value={value}
					onChange={onChange}
					onFocus={() => setFocused(true)}
					onBlur={handleBlur}
					required={required}
					pattern={pattern}
					placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
					aria-invalid={!!error}
					aria-describedby={error ? `${name}-error` : undefined}
					className={`
            w-full ${hasIcon ? "pl-11" : "pl-4"} pr-10 py-3 rounded-xl border
            transition-all duration-200 ease-in-out
            bg-gray-700 focus:bg-gray-600 /* Dark input background */
            focus:outline-none focus:ring-2 focus:ring-opacity-75
            text-gray-100 placeholder-gray-400 /* Light text, muted placeholder */
            ${
							focused
								? "border-primary-500 ring-primary-400" // Keep primary focus ring
								: "border-gray-600 hover:border-gray-500" // Darker borders
						}
            ${
							error
								? "border-red-500 ring-red-400" // Keep error colors for visibility
								: ""
						}
            ${
							isValid
								? "border-green-500 ring-green-400" // Keep valid colors for visibility
								: ""
						}
            disabled:bg-gray-800 disabled:cursor-not-allowed disabled:border-gray-700 disabled:opacity-60 /* Darker disabled state */
          `}
					whileFocus={{ scale: 1.01 }}
				/>

				{/* Validation Icons positioned absolutely on the right */}
				<div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
					{/* Keep validation icon colors for visibility */}
					{isValid && <Check className="h-5 w-5 text-green-500" />}
					{error && <AlertCircle className="h-5 w-5 text-red-500" />}
				</div>
			</div>
			<AnimatePresence>
				{error && touched && (
					<motion.p
						id={`${name}-error`}
						initial={{ opacity: 0, y: -5 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -5 }}
						className="mt-1.5 text-xs text-red-400" // Lighter error text
						role="alert"
					>
						{error}
					</motion.p>
				)}
			</AnimatePresence>
		</div>
	);
};
