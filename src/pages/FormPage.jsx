import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { useParams } from "react-router-dom";
import LeadForm from "@components/forms/LeadForm.jsx";
import Logo from "@components/ui/Logo";
import { useFormStore } from "@store/formStore";
import "@styles/FormPage.css";

const FormPage = () => {
	const { user, first_name, last_name, phone_number } = useParams();
	const { updateField, updateAgentInfo } = useFormStore();
	const [isOldBrowser, setIsOldBrowser] = useState(false);

	// Handle ViciDial parameters
	useEffect(() => {
		if (first_name) {
			updateField(
				"first_name",
				decodeURIComponent(first_name).replace(/--[AB]--/g, ""),
			);
		}
		if (last_name) {
			updateField(
				"last_name",
				decodeURIComponent(last_name).replace(/--[AB]--/g, ""),
			);
		}
		if (phone_number) {
			updateField(
				"contact_number",
				decodeURIComponent(phone_number).replace(/--[AB]--/g, ""),
			);
		}
		if (user) {
			// ViciDial agent name will be the user parameter
			updateAgentInfo(
				"agent_name",
				decodeURIComponent(user).replace(/--[AB]--/g, ""),
			);
		}
	}, [user, first_name, last_name, phone_number, updateField, updateAgentInfo]);

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
