/**
 * Browser detector script for compatibility fixes
 * This helps identify older browsers and apply specific patches
 */

// Execute the function immediately when loaded
(function () {
	var browserInfo = detectBrowser();

	// Add classes to the html element for CSS targeting
	if (browserInfo.isIE) {
		document.documentElement.className += " is-ie";
		document.documentElement.className += " ie" + browserInfo.version;
	}

	if (browserInfo.isChrome && browserInfo.version < 50) {
		document.documentElement.className += " old-chrome";
	}

	if (browserInfo.isWindows7) {
		document.documentElement.className += " windows7";
	}

	// Apply specific CSS overrides for detected browsers if needed
	applyBrowserSpecificFixes(browserInfo);

	// Make detection information available globally
	window.browserInfo = browserInfo;

	/**
	 * Detect browser information
	 * @return {Object} Browser information
	 */
	function detectBrowser() {
		var ua = navigator.userAgent;
		var browserInfo = {
			isIE: false,
			isEdge: false,
			isChrome: false,
			isFirefox: false,
			isSafari: false,
			version: null,
			isWindows: false,
			isWindows7: false,
			isModernBrowser: true,
		};

		// Detect IE
		if (ua.indexOf("MSIE") !== -1 || ua.indexOf("Trident/") !== -1) {
			browserInfo.isIE = true;
			browserInfo.isModernBrowser = false;

			var ieVersion =
				ua.indexOf("MSIE") !== -1
					? parseInt(ua.split("MSIE")[1])
					: parseInt(ua.split("rv:")[1]);

			browserInfo.version = ieVersion || 11; // Default to 11 if we can't detect
		}

		// Detect Edge (pre-Chromium)
		else if (ua.indexOf("Edge/") !== -1) {
			browserInfo.isEdge = true;
			browserInfo.version = parseInt(ua.split("Edge/")[1]);
		}

		// Detect Chrome
		else if (ua.indexOf("Chrome/") !== -1) {
			browserInfo.isChrome = true;
			var matches = ua.match(/Chrome\/(\d+)/);
			if (matches) {
				browserInfo.version = parseInt(matches[1]);
				if (browserInfo.version < 50) {
					browserInfo.isModernBrowser = false;
				}
			}
		}

		// Detect Firefox
		else if (ua.indexOf("Firefox/") !== -1) {
			browserInfo.isFirefox = true;
			var matches = ua.match(/Firefox\/(\d+)/);
			if (matches) {
				browserInfo.version = parseInt(matches[1]);
			}
		}

		// Detect Safari
		else if (ua.indexOf("Safari/") !== -1 && ua.indexOf("Chrome/") === -1) {
			browserInfo.isSafari = true;
			var matches = ua.match(/Version\/(\d+)/);
			if (matches) {
				browserInfo.version = parseInt(matches[1]);
			}
		}

		// Detect Windows
		browserInfo.isWindows = ua.indexOf("Windows") !== -1;

		// Detect Windows 7 specifically
		browserInfo.isWindows7 = ua.indexOf("Windows NT 6.1") !== -1;

		return browserInfo;
	}

	/**
	 * Apply specific fixes based on detected browser
	 * @param {Object} browserInfo Browser detection information
	 */
	function applyBrowserSpecificFixes(browserInfo) {
		// Create style element for browser-specific CSS
		var styleEl = document.createElement("style");
		styleEl.type = "text/css";

		var css = "";

		// IE specific fixes
		if (browserInfo.isIE) {
			// Disable transitions and animations in IE for better performance
			css += "* { animation: none !important; transition: none !important; }";

			// Fix flexbox in IE
			css += ".flex { display: block !important; text-align: center; }";
			css += ".items-center, .justify-center { text-align: center; }";

			// Fix gradient background for IE
			css += ".gradient-background { background-color: #0a0c10 !important; }";
			css += ".gradient-blob { display: none !important; }";
		}

		// Old Chrome (Windows 7 era) specific fixes
		if (browserInfo.isChrome && browserInfo.version < 50) {
			// Simplify box-shadows
			css +=
				".shadow-xl { box-shadow: 0 2px 5px rgba(0,0,0,0.15) !important; }";

			// Disable or simplify transitions
			css += ".button, input, a { transition-duration: 0.1s !important; }";

			// Reduce filter blur strength
			css += ".gradient-blob { filter: blur(50px) !important; }";
		}

		// Windows 7 specific fixes (any browser)
		if (browserInfo.isWindows7) {
			// Windows 7 font rendering fixes
			css +=
				"body { -webkit-font-smoothing: subpixel-antialiased !important; text-shadow: 1px 1px 1px rgba(0,0,0,0.004); }";

			// Use simpler gradients
			css +=
				".button-secondary, .gradient-blob { background: #131620 !important; }";
		}

		// Apply the CSS if we have any
		if (css) {
			styleEl.innerHTML = css;
			document.head.appendChild(styleEl);
		}
	}
})();
