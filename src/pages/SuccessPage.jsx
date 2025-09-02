import '@styles/SuccessPage.css';

import {
  useEffect,
  useState,
} from 'react';

import { motion } from 'framer-motion';
import {
  CheckCircle,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@components/ui/Button';
import Logo from '@components/ui/Logo';
import { useFormStore } from '@store/formStore';

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
			} else if (storedApiResponse.data?.redirect_url) {
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
		
					if (parsedResponse.data?.redirect_url) {
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
	}, [apiResponse, redirectUrl, resetForm]);

	const handleManualRedirect = () => {
		// Try all possible locations for the redirect URL, including session storage
		const url =
			redirectUrl ||
			apiResponse?.redirect_url ||
			apiResponse?.data?.redirect_url ||
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
				apiResponse?.redirect_url ||
				apiResponse?.data?.redirect_url ||
				sessionStorage.getItem("redirectUrl")
		);
		setHasRedirectUrl(hasUrl);
	}, [redirectUrl, apiResponse]);

	return (
		<div className="success-page">
			<motion.div
				className="header-container"
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.1, ease: "easeOut" }}
			>
				<Logo size={32} />
			</motion.div>

			<motion.div
				className="success-card"
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
					className="success-icon-wrapper"
				>
					<CheckCircle className="success-icon" />
				</motion.div>

				<h1 className="success-title">
					<span className="success-title-accent">Submission</span> Received!
				</h1>
				<p className="success-message">
					Thank you! The customer's information has been successfully
					transferred and recorded.
				</p>

				{isRedirecting ? (
					<motion.div
						className="success-info"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
					>
						<p className="success-info-heading">
							<ExternalLink size={16} className="info-icon" />
							Redirecting to Pineapple in {countdown} seconds...
						</p>
						<div className="url-display">
							{redirectUrl ||
								apiResponse?.redirect_url ||
								sessionStorage.getItem("redirectUrl") ||
								""}
						</div>
					</motion.div>
				) : hasRedirectUrl ? null : (
					<motion.div
						className="warning-info"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
					>
						<p className="warning-heading">
							<ExternalLink size={16} className="info-icon" />
							No redirect URL was found
						</p>
					</motion.div>
				)}

				<div className="action-container">
					<Button
						onClick={() => navigate("/")}
						variant="primary"
						className="action-button"
					>
						<RefreshCw size={18} className="button-icon" />
						Submit Another Transfer
					</Button>

					{hasRedirectUrl && (
						<Button
							onClick={handleManualRedirect}
							variant="outline"
							className="action-button"
						>
							<ExternalLink size={18} className="button-icon" />
							Go to Pineapple Now
						</Button>
					)}
				</div>
			</motion.div>
		</div>
	);
};

export default SuccessPage;
