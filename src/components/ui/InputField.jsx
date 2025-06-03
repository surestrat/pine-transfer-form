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
            bg-[#131620] focus:bg-[#1c2130] /* Modern darker input background */
            focus:outline-none focus:ring-2 focus:ring-opacity-75 shadow-inner
            text-gray-100 placeholder-gray-500 /* Light text, muted placeholder */
            ${
							focused
								? "border-teal-500 ring-teal-500/20" // Modern teal focus ring
								: "border-[#2a3142] hover:border-[#3a4154]" // More distinct border colors
						}
            ${
							error
								? "border-red-500/70 ring-red-500/20" // Slightly muted error colors for better dark theme harmony
								: ""
						}
            ${
							isValid
								? "border-teal-600/70 ring-teal-500/20" // Use teal instead of green for consistency
								: ""
						}
            disabled:bg-[#0f1219] disabled:cursor-not-allowed disabled:border-[#20253a] disabled:opacity-60 /* Even darker disabled state */
          `}
					whileFocus={{ scale: 1.01 }}
				/>

				{/* Validation Icons positioned absolutely on the right */}
				<div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
					{/* Use teal for valid state */}
					{isValid && <Check className="h-5 w-5 text-teal-400" />}
					{error && <AlertCircle className="h-5 w-5 text-red-400" />}
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
