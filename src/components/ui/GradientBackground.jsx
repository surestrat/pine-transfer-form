import React from "react";
import { motion } from "framer-motion";

export const GradientBackground = () => {
	return (
		<div className="absolute inset-0 overflow-hidden -z-10">
			{/* Ensure it's behind content */}
			<motion.div
				className="absolute top-[-20%] right-[-15%] w-[50%] h-[50%] rounded-full filter blur-[150px] opacity-20"
				style={{ background: "#161b24" }} // Use direct hex color
				animate={{
					scale: [1, 1.15, 1],
					opacity: [0.15, 0.25, 0.15],
				}}
				transition={{
					duration: 18,
					repeat: Infinity,
					repeatType: "reverse",
					ease: "easeInOut",
				}}
			/>
			<motion.div
				className="absolute bottom-[-20%] left-[-15%] w-[50%] h-[50%] rounded-full filter blur-[150px] opacity-20"
				style={{ background: "#161b24" }} // Use a slightly different dark blue for secondary
				animate={{
					scale: [1, 1.25, 1],
					opacity: [0.15, 0.25, 0.15],
				}}
				transition={{
					duration: 21,
					repeat: Infinity,
					repeatType: "reverse",
					delay: 2,
					ease: "easeInOut",
				}}
			/>
			<motion.div
				className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full filter blur-[120px] opacity-15"
				style={{ background: "#161b24" }} // Another dark blue for subtlety
				animate={{
					scale: [1, 1.1, 1],
					x: [0, 30, 0],
					opacity: [0.1, 0.2, 0.1],
				}}
				transition={{
					duration: 25,
					repeat: Infinity,
					repeatType: "reverse",
					delay: 4,
					ease: "easeInOut",
				}}
			/>
		</div>
	);
};
