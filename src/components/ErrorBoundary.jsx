import React, { Component } from "react";

class ErrorBoundary extends Component {
	state = {
		hasError: false,
		error: null,
	};

	static getDerivedStateFromError(error) {
		return { hasError: true, error: error };
	}

	componentDidCatch(error, errorInfo) {
		console.error("Uncaught error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div
					role="alert"
					className="p-6 border border-red-500/30 rounded-xl bg-[#131620] shadow-lg max-w-2xl mx-auto my-8"
				>
					<div className="flex items-center mb-4">
						<div className="w-10 h-10 flex-shrink-0 bg-red-500/20 rounded-full flex items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-red-400"
							>
								<path d="M12 8v4"></path>
								<path d="M12 16h.01"></path>
								<circle cx="12" cy="12" r="10"></circle>
							</svg>
						</div>
						<h2 className="text-xl font-semibold ml-3 text-red-300">
							Oops! Something went wrong.
						</h2>
					</div>
					<p className="text-gray-300 mb-4">
						We encountered an error processing your request. Please try
						refreshing the page or contact support if the problem persists.
					</p>

					{process.env.NODE_ENV === "development" && this.state.error && (
						<details className="bg-[#0a0c10] p-4 rounded-lg border border-gray-700 mt-4">
							<summary className="cursor-pointer font-medium text-teal-400 flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="mr-2"
								>
									<path d="M12 9v4"></path>
									<path d="M12 17h.01"></path>
									<rect width="20" height="14" x="2" y="5" rx="2"></rect>
									<path d="M2 10h20"></path>
								</svg>
								Error Details (Development Only)
							</summary>

							<p className="my-3 text-red-300">{this.state.error.message}</p>
							<pre className="mt-2 p-3 bg-[#0f1219] overflow-x-auto text-sm text-gray-300 rounded border border-gray-800">
								{this.state.error.stack}
							</pre>
						</details>
					)}

					<button
						onClick={() => window.location.reload()}
						className="mt-5 bg-teal-600 hover:bg-teal-500 text-white py-2.5 px-5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg border border-teal-500/30"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="mr-2"
						>
							<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
							<path d="M3 3v5h5"></path>
							<path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
							<path d="M16 21h5v-5"></path>
						</svg>
						Try Again
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
