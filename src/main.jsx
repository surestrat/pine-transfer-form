import '@styles/index.css';

import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { testEnvironmentVariables } from '@utils/env-test.js';

import App from './App.jsx';

// Test environment variables on startup
testEnvironmentVariables();

// Create a promise that resolves when the stylesheet is loaded
const stylesLoaded = new Promise((resolve) => {
	const styleSheets = Array.from(document.styleSheets);
	if (styleSheets.length > 0) {
		resolve();
	} else {
		const styleObserver = new MutationObserver(() => {
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
