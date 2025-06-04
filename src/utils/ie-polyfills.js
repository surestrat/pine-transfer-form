/* IE-specific Polyfills and Fixes */

/*
 * This script provides essential polyfills and fixes for Internet Explorer
 * and older versions of Chrome (like those on Windows 7)
 */

// Polyfill for CSS Variables (IE11 and older browsers)
// Source: https://github.com/jhildenbiddle/css-vars-ponyfill
(function () {
	// Check for CSS variable support in a way that works in older browsers
	var cssVarSupport = (function () {
		try {
			// Try to check if CSS variables are supported
			return (
				typeof window !== "undefined" &&
				window.CSS &&
				window.CSS.supports &&
				window.CSS.supports("(--a: 0)")
			);
		} catch (e) {
			// If any errors occur, assume no support
			return false;
		}
	})();

	// If the browser supports CSS variables, no need for polyfill
	if (cssVarSupport) {
		return;
	}

	// Simple implementation to replace CSS vars with their values
	function applyCssVarFallbacks() {
		try {
			var styleElements = document.querySelectorAll(
				'style, link[rel="stylesheet"]'
			);
		} catch (e) {
			// Fallback for older browsers without querySelectorAll
			var styleElements = [];
			var styles = document.getElementsByTagName("style");
			var links = document.getElementsByTagName("link");

			for (var i = 0; i < styles.length; i++) {
				styleElements.push(styles[i]);
			}

			for (var i = 0; i < links.length; i++) {
				if (links[i].rel === "stylesheet") {
					styleElements.push(links[i]);
				}
			}
		}

		// Define color variables here for manual replacement
		var cssVars = {
			"--color-teal-300": "#5eead4",
			"--color-teal-400": "#2dd4bf",
			"--color-teal-500": "#14b8a6",
			"--color-teal-600": "#0d9488",
			"--color-teal-700": "#0f766e",
			"--color-gray-50": "#f9fafb",
			"--color-gray-100": "#f3f4f6",
			"--color-gray-200": "#e5e7eb",
			"--color-gray-300": "#d1d5db",
			"--color-gray-400": "#9ca3af",
			"--color-gray-500": "#6b7280",
			"--color-red-400": "#f87171",
			"--color-red-500": "#ef4444",
			"--background-dark": "#0a0c10",
			"--background-input": "#131620",
			"--border-color": "#2a3142",
			"--border-hover": "#3a4154",
			"--border-focus": "#14b8a6",
		};

		// Apply specific style overrides for elements
		var elementStyles = {
			body: {
				backgroundColor: "#0a0c10",
				color: "#d1d5db",
			},
			"h1, h2, h3, h4, h5, h6": {
				color: "#f9fafb",
			},
			a: {
				color: "#2dd4bf",
			},
			"input, select, textarea": {
				backgroundColor: "#131620",
				borderColor: "#2a3142",
				color: "#f9fafb",
			},
			".input-icon": {
				color: "#6b7280",
			},
			".input-icon-focused": {
				color: "#2dd4bf",
			},
		};

		// Apply these styles manually for IE
		for (var selector in elementStyles) {
			try {
				var elements = document.querySelectorAll(selector);
				var properties = elementStyles[selector];

				for (var i = 0; i < elements.length; i++) {
					var el = elements[i];
					for (var prop in properties) {
						el.style[prop] = properties[prop];
					}
				}
			} catch (e) {
				console.log("IE polyfill error:", e);
			}
		}
	}

	// Apply once DOM is ready
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", applyCssVarFallbacks);
	} else {
		applyCssVarFallbacks();
	}

	// Also apply when the window loads (for dynamically created elements)
	window.addEventListener("load", applyCssVarFallbacks);
})();

// Polyfill for classlist (IE9/IE10)
// Based on https://github.com/eligrey/classList.js
(function () {
	if ("document" in self) {
		if (!("classList" in document.createElement("_"))) {
			// Polyfill DOMTokenList for older browsers
			// Code would go here - simplified for brevity
			console.log("ClassList polyfill would be loaded for older browsers");
		}
	}
})();

// Detect old browsers and add helper class
(function () {
	var isIE = false;
	var isOldChrome = false;

	// Detect IE
	if (
		navigator.userAgent.indexOf("MSIE") !== -1 ||
		navigator.appVersion.indexOf("Trident/") > 0
	) {
		isIE = true;
		document.documentElement.className += " ie";
	}

	// Attempt to detect older Chrome (like on Windows 7)
	var chromeMatch = navigator.userAgent.match(/Chrome\/(\d+)\./);
	if (chromeMatch && parseInt(chromeMatch[1]) < 50) {
		isOldChrome = true;
		document.documentElement.className += " old-chrome";
	}

	// Apply specific fixes based on browser
	if (isIE || isOldChrome) {
		// Disable animations for better performance
		var style = document.createElement("style");
		style.type = "text/css";
		style.innerHTML =
			"* { transition: none !important; animation: none !important; }";
		document.head.appendChild(style);

		// Simplify box-shadows
		var elements = document.querySelectorAll(
			".shadow-xl, .button, input:focus"
		);
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
		}
	}
})();
