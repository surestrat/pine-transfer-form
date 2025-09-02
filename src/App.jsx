import { motion } from 'framer-motion';
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import ErrorBoundary from '@components/ErrorBoundary'; // Import ErrorBoundary
import { GradientBackground } from '@components/ui/GradientBackground';
import FormPage from '@pages/FormPage';
import QuotePage from '@pages/QuotePage';
import SuccessPage from '@pages/SuccessPage';
import WaitingPage from '@pages/WaitingPage';

function App() {
	return (
		<BrowserRouter>
			<ErrorBoundary
				fallback={<p>Something went wrong loading the application.</p>}
			>
				{" "}
				{/* Wrap with ErrorBoundary */}{" "}
				<div
					className="app-container"
					style={{ background: "#0a0c10" }} // Deeper black background
				>
					{/* Updated dark background */}
					<GradientBackground />
					<motion.div
						className="app-content" // Using custom class instead of Tailwind
						initial={{ opacity: 0, y: 10 }} // Added subtle entry animation
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: "easeOut" }}
					>
						<Routes>
							<Route path="/" element={<FormPage />} />
							{/* ViciDial URL format route */}
							<Route
								path="/:user/:first_name/:last_name/:phone_number"
								element={<FormPage />}
							/>
							<Route path="/success" element={<SuccessPage />} />
							<Route path="/quote" element={<QuotePage />} />
							<Route path="/waiting" element={<WaitingPage />} />
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
