import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "@styles/GradientBackground.css";

export const GradientBackground = () => {
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

		// Also detect if the browser supports filters
		const supportsFilter = (() => {
			try {
				// Create a test element to check for filter support
				const testEl = document.createElement("div");
				testEl.style.cssText = "filter: blur(5px);";
				return testEl.style.length > 0 && testEl.style.filter !== "";
			} catch (e) {
				return false;
			}
		})();

		setIsOldBrowser(isIE || isOldChrome || !supportsFilter);
	}, []);

	// For older browsers, use the CSS-only version with fallbacks
	if (isOldBrowser) {
		return (
			<div className="gradient-background">
				<div className="gradient-blob gradient-blob-1"></div>
				<div className="gradient-blob gradient-blob-2"></div>
				<div className="gradient-blob gradient-blob-3"></div>
				<div className="gradient-blob gradient-blob-4"></div>
			</div>
		);
	}

	return (
		<div className="absolute inset-0 overflow-hidden -z-10">
			{/* Modern gradient background with teal accents */}
			<motion.div
				className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full filter blur-[180px] opacity-20"
				style={{
					background: "linear-gradient(135deg, #0d9488 0%, #134e4a 100%)",
				}} // Teal gradient
				animate={{
					scale: [1, 1.2, 1],
					opacity: [0.1, 0.18, 0.1], // Enhanced teal glow
				}}
				transition={{
					duration: 20,
					repeat: Infinity,
					repeatType: "reverse",
					ease: "easeInOut",
				}}
			/>
			<motion.div
				className="absolute bottom-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full filter blur-[160px] opacity-20"
				style={{
					background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
				}} // Dark blue gradient
				animate={{
					scale: [1, 1.3, 1],
					opacity: [0.15, 0.25, 0.15],
				}}
				transition={{
					duration: 25,
					repeat: Infinity,
					repeatType: "reverse",
					delay: 2,
					ease: "easeInOut",
				}}
			/>
			<motion.div
				className="absolute top-[30%] left-[25%] w-[40%] h-[40%] rounded-full filter blur-[140px] opacity-15"
				style={{
					background: "linear-gradient(135deg, #115e59 0%, #042f2e 100%)",
				}} // Deeper teal gradient
				animate={{
					scale: [1, 1.15, 1],
					x: [0, 40, 0],
					opacity: [0.06, 0.12, 0.06], // More noticeable
				}}
				transition={{
					duration: 28,
					repeat: Infinity,
					repeatType: "reverse",
					delay: 4,
					ease: "easeInOut",
				}}
			/>
			<motion.div
				className="absolute top-[60%] right-[20%] w-[25%] h-[25%] rounded-full filter blur-[100px] opacity-10"
				style={{
					background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
				}} // Bright teal accent
				animate={{
					scale: [1, 1.2, 1],
					y: [0, -30, 0],
					opacity: [0.05, 0.1, 0.05],
				}}
				transition={{
					duration: 18,
					repeat: Infinity,
					repeatType: "reverse",
					delay: 6,
					ease: "easeInOut",
				}}
			/>
		</div>
	);
};
