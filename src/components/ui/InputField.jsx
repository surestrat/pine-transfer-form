import '@styles/InputField.css';

import React, {
  useEffect,
  useId,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import {
  AlertCircle,
  Check,
} from 'lucide-react';

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
 icon: Icon,
 optional = false,
 id: idProp,
}) => {
 const reactId = useId();
 const id = idProp || `${name}-${reactId}`;
 const errorId = `${id}-error`;

 // Always use a string for value to avoid controlled/uncontrolled warning
 const safeValue = value === undefined || value === null ? "" : value;
	const [focused, setFocused] = useState(false);
	const [touched, setTouched] = useState(false);
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

	const isValid =
		touched && (optional ? !value || (value && !error) : value && !error);

	const handleBlur = (e) => {
		if (onChange) {
			onChange(e);
		}
		setFocused(false);
		setTouched(true);
	};

	const hasIcon = !!Icon;

	// Build className strings
	const inputClassName = [
		"input-control",
		hasIcon ? "input-with-icon" : "",
		focused ? "input-focused" : "",
		error && touched ? "input-error" : "",
		isValid ? "input-valid" : "",
	]
		.filter(Boolean)
		.join(" ");

	const iconClassName = ["input-icon", focused ? "input-icon-focused" : ""]
		.filter(Boolean)
		.join(" ");

	 return (
		 <div className="input-field-container">
			 <label htmlFor={id} className="input-label">
				 {label} {required && <span className="input-label-required">*</span>}
			 </label>
			 <div className="input-wrapper">
				 {/* Icon positioned absolutely on the left */}
				 {hasIcon && (
					 <div className="input-icon-left">
						 <Icon className={iconClassName} />
					 </div>
				 )}
				 {isOldBrowser ? (
					// Regular input for older browsers
					<input
						id={id}
						name={name}
						type={type}
						value={safeValue}
						onChange={onChange}
						onFocus={() => setFocused(true)}
						onBlur={handleBlur}
						required={required}
						pattern={pattern}
						placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
						aria-invalid={!!error}
						aria-describedby={error ? errorId : undefined}
						className={inputClassName}
					/>
				 ) : (
					// Motion input for modern browsers
					<motion.input
						id={id}
						name={name}
						type={type}
						value={safeValue}
						onChange={onChange}
						onFocus={() => setFocused(true)}
						onBlur={handleBlur}
						required={required}
						pattern={pattern}
						placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
						aria-invalid={!!error}
						aria-describedby={error ? errorId : undefined}
						className={inputClassName}
						whileFocus={{ scale: 1.01 }}
					/>
				 )}
				 {/* Validation Icons positioned absolutely on the right */}
				 <div className="input-validation-icon">
					 {isValid && <Check className="input-valid-icon" />}
					 {error && touched && <AlertCircle className="input-error-icon" />}
				 </div>
			 </div>

			 {/* Error message - conditional rendering based on browser */}
			 {error &&
				 touched &&
				 (isOldBrowser ? (
					 <p id={errorId} className="input-error-message" role="alert">
						 {error}
					 </p>
				 ) : (
					 <AnimatePresence>
						 <motion.p
							 id={errorId}
							 initial={{ opacity: 0, y: -5 }}
							 animate={{ opacity: 1, y: 0 }}
							 exit={{ opacity: 0, y: -5 }}
							 className="input-error-message"
							 role="alert"
						 >
							 {error}
						 </motion.p>
					 </AnimatePresence>
				 ))}
		 </div>
	 );
};
