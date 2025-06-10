import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@styles/index.css";
import App from "./App.jsx";

// Create a promise that resolves when the stylesheet is loaded
const stylesLoaded = new Promise((resolve) => {
	const styleSheets = Array.from(document.styleSheets);
	if (styleSheets.length > 0) {
		resolve();
	} else {
		const styleObserver = new MutationObserver((mutations) => {
			if (document.styleSheets.length > 0) {
				resolve();
				styleObserver.disconnect();
			}
		});
		styleObserver.observe(document.head, { childList: true });
	}
});

// Wait for styles to load before rendering
stylesLoaded.then(() => {
	createRoot(document.getElementById("root")).render(
		<StrictMode>
			<App />
		</StrictMode>
	);
});
