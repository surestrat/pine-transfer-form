import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
// Updated import path to use proper component import
import LeadForm from "@components/forms/LeadForm.jsx";
import Logo from "@components/ui/Logo"; // Use alias for consistency
import "@styles/FormPage.css"; // Import converted CSS

const FormPage = () => {
	const [isOldBrowser, setIsOldBrowser] = useState(false);

	// Check if we're in an older browser environment
	useEffect(() => {
		// Simple detection for older browsers
		const isIE = !!document.documentMode;
		const isOldChrome =
			window.navigator.userAgent.indexOf("Chrome") > -1 &&
			(window.navigator.userAgent.indexOf("Windows NT 6.1") > -1 ||
				(window.navigator.userAgent.match(/Chrome\/(\d+)/) &&
					parseInt(window.navigator.userAgent.match(/Chrome\/(\d+)/)[1]) < 50));

		setIsOldBrowser(isIE || isOldChrome);
	}, []);

	return (
		<div className="form-page">
			{isOldBrowser ? (
				// Standard div for older browsers
				<div className="header-container">
					<Logo size={32} />
					<div className="secure-badge">
						<Lock size={14} className="secure-icon" />
						<span className="secure-text">Secure Connection</span>
					</div>
				</div>
			) : (
				// Motion div for modern browsers
				<motion.div
					className="header-container"
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.1, ease: "easeOut" }}
				>
					<Logo size={32} />
					<div className="secure-badge">
						<Lock size={14} className="secure-icon" />
						<span className="secure-text">Secure Connection</span>
					</div>
				</motion.div>
			)}

			{isOldBrowser ? (
				// Standard div for older browsers
				<div className="title-container">
					<h1 className="page-title">
						<span className="title-accent">Pineapple</span> Customer Information
						Transfer
					</h1>
					<p className="page-description">
						Please fill out the secure form below to transfer the customer
						details accurately and quickly.
					</p>
				</div>
			) : (
				// Motion div for modern browsers
				<motion.div
					className="title-container"
					initial={{ y: -10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2, ease: "easeOut" }}
				>
					<h1 className="page-title">
						<span className="title-accent">Pineapple</span> Customer Information
						Transfer
					</h1>
					<p className="page-description">
						Please fill out the secure form below to transfer the customer
						details accurately and quickly.
					</p>
				</motion.div>
			)}

			{isOldBrowser ? (
				// Standard div for older browsers
				<div className="form-card">
					<LeadForm />
				</div>
			) : (
				// Motion div for modern browsers
				<motion.div
					className="form-card"
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.3, ease: "easeOut" }}
				>
					<LeadForm />
				</motion.div>
			)}
		</div>
	);
};

export default FormPage;
