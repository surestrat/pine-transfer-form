// Ensure SVG and basic features are available for Lucide icons
// This script runs before icons are loaded

(function () {
	// More comprehensive SVG support detection
	function checkSvgSupport() {
		// Method 1: Feature detection
		const hasFeatureAPI =
			document.implementation &&
			document.implementation.hasFeature &&
			document.implementation.hasFeature(
				"http://www.w3.org/TR/SVG11/feature#BasicStructure",
				"1.1"
			);

		// Method 2: Object creation test
		let hasSvgSupport = false;
		try {
			hasSvgSupport =
				!!document.createElementNS &&
				!!document.createElementNS("http://www.w3.org/2000/svg", "svg")
					.createSVGRect;
		} catch (e) {
			hasSvgSupport = false;
		}

		return hasFeatureAPI || hasSvgSupport;
	}

	// Add no-svg-support class if SVG isn't properly supported
	if (!checkSvgSupport()) {
		console.warn(
			"SVG not fully supported in this browser. Adding fallback class."
		);
		document.addEventListener("DOMContentLoaded", function () {
			document.body.classList.add("no-svg-support");
		});
	}

	// Ensure requestAnimationFrame is available (required by Framer Motion animations)
	window.requestAnimationFrame =
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, 1000 / 60);
		};

	// Mark Lucide icons with a class for potential fallbacks
	document.addEventListener("DOMContentLoaded", function () {
		setTimeout(function () {
			document.querySelectorAll("[data-lucide]").forEach(function (icon) {
				icon.classList.add("lucide-icon");
			});
		}, 100);
	});
})();
