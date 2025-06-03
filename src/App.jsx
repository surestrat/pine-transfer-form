import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import FormPage from "@pages/FormPage";
import SuccessPage from "@pages/SuccessPage";
import { GradientBackground } from "@components/ui/GradientBackground";
import ErrorBoundary from "@components/ErrorBoundary"; // Import ErrorBoundary

function App() {
	return (
		<BrowserRouter>
			<ErrorBoundary
				fallback={<p>Something went wrong loading the application.</p>}
			>
				{" "}
				{/* Wrap with ErrorBoundary */}
				<div
					className="min-h-screen relative overflow-hidden font-sans bg-[#0a0c10]"
					style={{ background: "#0a0c10" }} // Deeper black background
				>
					{/* Updated dark background */}
					<GradientBackground />
					<motion.div
						className="relative z-10 w-full max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:py-20" // Reduced max-width, increased vertical padding
						initial={{ opacity: 0, y: 10 }} // Added subtle entry animation
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: "easeOut" }}
					>
						<Routes>
							<Route path="/" element={<FormPage />} />
							<Route path="/success" element={<SuccessPage />} />
							{/* Add a fallback route if needed */}
							{/* <Route path="*" element={<NotFoundPage />} /> */}
						</Routes>
					</motion.div>
				</div>
			</ErrorBoundary>
		</BrowserRouter>
	);
}

export default App;
