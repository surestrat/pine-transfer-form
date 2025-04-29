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
					style={{
						padding: "20px",
						border: "1px solid #f56565",
						borderRadius: "4px",
						backgroundColor: "#161b24",
						color: "#c53030",
					}}
				>
					<h2>Oops! Something went wrong.</h2>
					<p>
						We encountered an error processing your request. Please try
						refreshing the page or contact support if the problem persists.
					</p>

					{process.env.NODE_ENV === "development" && this.state.error && (
						<details style={{ whiteSpace: "pre-wrap", marginTop: "10px" }}>
							<summary style={{ cursor: "pointer", fontWeight: "bold" }}>
								Error Details (Development Only)
							</summary>

							<p>{this.state.error.message}</p>
							<pre
								style={{
									marginTop: "5px",
									fontSize: "0.8em",
									background: "#161b24",
									padding: "5px",
								}}
							>
								{this.state.error.stack}
							</pre>
						</details>
					)}
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
