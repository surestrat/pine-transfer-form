import React from "react";
import { motion } from "framer-motion";

export const GradientBackground = () => {
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
