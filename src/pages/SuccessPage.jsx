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
		// Store values locally to prevent issues with state reset
		const storedRedirectUrl = redirectUrl;
		const storedApiResponse = apiResponse;

		// Check API response directly as a fallback
		let finalRedirectUrl = storedRedirectUrl;

		console.log("Initial redirect check:", {
			redirectUrl: storedRedirectUrl,
			apiResponse: storedApiResponse,
		});

		// If redirectUrl is not set, try to extract it from apiResponse
		if (!finalRedirectUrl && storedApiResponse) {
			// Try all potential locations for redirect_url
			if (storedApiResponse.redirect_url) {
				finalRedirectUrl = storedApiResponse.redirect_url;
				console.log(
					"Found redirect URL in apiResponse.redirect_url:",
					finalRedirectUrl
				);
			} else if (
				storedApiResponse.data &&
				storedApiResponse.data.redirect_url
			) {
				finalRedirectUrl = storedApiResponse.data.redirect_url;
				console.log(
					"Found redirect URL in apiResponse.data.redirect_url:",
					finalRedirectUrl
				);
			} else if (storedApiResponse.api_response) {
				// Try to parse if it's a string
				try {
					const parsedResponse =
						typeof storedApiResponse.api_response === "string"
							? JSON.parse(storedApiResponse.api_response)
							: storedApiResponse.api_response;

					if (parsedResponse.data && parsedResponse.data.redirect_url) {
						finalRedirectUrl = parsedResponse.data.redirect_url;
						console.log(
							"Found redirect URL in parsed api_response:",
							finalRedirectUrl
						);
					}
				} catch (error) {
					console.error("Error parsing API response:", error);
				}
			}
		}

		// Store the URL in session storage before resetting the form
		if (finalRedirectUrl) {
			sessionStorage.setItem("redirectUrl", finalRedirectUrl);
		} else {
			// Try to get from session storage as last resort
			finalRedirectUrl = sessionStorage.getItem("redirectUrl");
		}

		// Handle form reset (do this after extracting and saving the URL)
		resetForm();

		// Redirect logic only if finalRedirectUrl exists
		if (finalRedirectUrl) {
			console.log("Using redirect URL:", finalRedirectUrl);
			setIsRedirecting(true);

			// Set up countdown timer
			const timer = setInterval(() => {
				setCountdown((prev) => {
					if (prev <= 1) {
						clearInterval(timer);
						// Redirect to the URL
						console.log("Redirecting now to:", finalRedirectUrl);
						window.location.href = finalRedirectUrl;
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			// Clean up timer
			return () => clearInterval(timer);
		} else {
			console.log(
				"No redirect URL found in any response object. API Response:",
				storedApiResponse
			);
		}
	}, []);

	const handleManualRedirect = () => {
		// Try all possible locations for the redirect URL, including session storage
		const url =
			redirectUrl ||
			(apiResponse && apiResponse.redirect_url) ||
			(apiResponse && apiResponse.data && apiResponse.data.redirect_url) ||
			sessionStorage.getItem("redirectUrl");

		if (url) {
			window.location.href = url;
		}
	};

	// Determine if we have a valid redirect URL from any source
	const [hasRedirectUrl, setHasRedirectUrl] = useState(false);

	// Check all possible sources for redirect URL
	useEffect(() => {
		const hasUrl = Boolean(
			redirectUrl ||
				(apiResponse && apiResponse.redirect_url) ||
				(apiResponse && apiResponse.data && apiResponse.data.redirect_url) ||
				sessionStorage.getItem("redirectUrl")
		);
		setHasRedirectUrl(hasUrl);
	}, [redirectUrl, apiResponse]);

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
				className="bg-[#131620] rounded-2xl shadow-xl p-8 sm:p-12 text-center border border-[#2a3142]"
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
					className="w-24 h-24 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl ring-4 ring-teal-500/20"
				>
					<CheckCircle className="w-12 h-12 text-white" />
				</motion.div>

				<h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4">
					<span className="text-teal-400">Submission</span> Received!
				</h1>
				<p className="text-gray-300 mb-5 max-w-md mx-auto text-lg leading-relaxed">
					Thank you! The customer's information has been successfully
					transferred and recorded.
				</p>

				{isRedirecting ? (
					<motion.div
						className="mb-8 p-4 bg-[#1c2130] border border-teal-500/20 rounded-xl mx-auto max-w-md shadow-inner"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
					>
						<p className="text-teal-400 mb-2 flex items-center justify-center font-medium">
							<ExternalLink size={16} className="mr-2" />
							Redirecting to Pineapple in {countdown} seconds...
						</p>
						<div className="text-xs text-gray-400 truncate overflow-hidden px-2 py-1 bg-[#131620] rounded-lg">
							{redirectUrl ||
								(apiResponse && apiResponse.redirect_url) ||
								sessionStorage.getItem("redirectUrl") ||
								""}
						</div>
					</motion.div>
				) : hasRedirectUrl ? null : (
					<motion.div
						className="mb-8 p-4 bg-[#1c1c28] border border-yellow-500/20 rounded-xl mx-auto max-w-md shadow-inner"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
					>
						<p className="text-yellow-300 mb-2 flex items-center justify-center">
							<ExternalLink size={16} className="mr-2" />
							No redirect URL was found
						</p>
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

					{hasRedirectUrl && (
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
