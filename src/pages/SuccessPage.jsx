import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, RefreshCw, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/ui/Logo";
import { Button } from "../components/ui/Button";
import { useFormStore } from "../store/formStore";

const SuccessPage = () => {
	const navigate = useNavigate();
	const resetForm = useFormStore((state) => state.resetForm);
	const apiResponse = useFormStore((state) => state.apiResponse);
	const redirectUrl = useFormStore((state) => state.redirectUrl);
	const [countdown, setCountdown] = useState(5);
	const [isRedirecting, setIsRedirecting] = useState(false);

	useEffect(() => {
		// Handle form reset
		resetForm();

		// Redirect logic only if redirectUrl exists
		if (redirectUrl) {
			setIsRedirecting(true);

			// Set up countdown timer
			const timer = setInterval(() => {
				setCountdown((prev) => {
					if (prev <= 1) {
						clearInterval(timer);
						// Redirect to the URL
						window.location.href = redirectUrl;
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			// Clean up timer
			return () => clearInterval(timer);
		}
	}, [redirectUrl, resetForm]);

	const handleManualRedirect = () => {
		if (redirectUrl) {
			window.location.href = redirectUrl;
		}
	};

	return (
		<div className="relative">
			<motion.div
				className="mb-10 flex items-center justify-between"
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.1, ease: "easeOut" }}
			>
				<Logo size={32} />
			</motion.div>

			<motion.div
				className="bg-gray-800 rounded-2xl shadow-card p-8 sm:p-12 text-center"
				initial={{ scale: 0.95, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
			>
				<motion.div
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{
						delay: 0.4,
						type: "spring",
						stiffness: 300,
						damping: 15,
					}}
					className="w-24 h-24 bg-gradient-to-br from-green-400 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
				>
					<CheckCircle className="w-12 h-12 text-white" />
				</motion.div>

				<h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4">
					Submission Received!
				</h1>
				<p className="text-gray-300 mb-5 max-w-md mx-auto text-lg">
					Thank you! The customer's information has been successfully
					transferred and recorded.
				</p>

				{redirectUrl && isRedirecting && (
					<motion.div
						className="mb-8 p-4 bg-gray-700 rounded-lg mx-auto max-w-md"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
					>
						<p className="text-primary-300 mb-2 flex items-center justify-center">
							<ExternalLink size={16} className="mr-2" />
							Redirecting to Pineapple in {countdown} seconds...
						</p>
						<div className="text-xs text-gray-400 truncate overflow-hidden">
							{redirectUrl}
						</div>
					</motion.div>
				)}

				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button
						onClick={() => navigate("/")}
						variant="primary"
						className="mx-auto"
					>
						<RefreshCw size={18} className="mr-2" />
						Submit Another Transfer
					</Button>

					{redirectUrl && (
						<Button
							onClick={handleManualRedirect}
							variant="outline"
							className="mx-auto"
						>
							<ExternalLink size={18} className="mr-2" />
							Go to Pineapple Now
						</Button>
					)}
				</div>
			</motion.div>
		</div>
	);
};

export default SuccessPage;
