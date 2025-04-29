import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		// Email middleware plugin removed - will be implemented later
	],
	server: {
		// Fix HMR connection issues
		hmr: {
			timeout: 5000,
		},
		// Setup proxy for the gw-test.pineapple.co.za API calls
		proxy: {
			"/pineapple-api": {
				target: "http://gw-test.pineapple.co.za",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/pineapple-api/, ""),
				secure: false,
				configure: (proxy, _options) => {
					proxy.on("error", (err, _req, _res) => {
						console.log("proxy error", err);
					});
					proxy.on("proxyReq", (proxyReq, req, _res) => {
						console.log("Sending Request:", req.method, req.url);

						// Ensure proper headers for the proxy request
						proxyReq.setHeader("Content-Type", "application/json");

						// Add authorization header if it exists in the original request
						const authHeader = req.headers["authorization"];
						if (authHeader) {
							proxyReq.setHeader("Authorization", authHeader);
						}
					});
					proxy.on("proxyRes", (proxyRes, req, _res) => {
						const statusCode = proxyRes.statusCode;
						console.log(
							`Received Response from: ${req.url} with status: ${statusCode}`
						);

						// Enhanced error logging for 500 responses
						if (statusCode >= 400) {
							let responseBody = "";
							proxyRes.on("data", (chunk) => {
								responseBody += chunk.toString();
							});

							proxyRes.on("end", () => {
								try {
									const parsedBody = JSON.parse(responseBody);
									console.log(
										`Error response details for ${req.url}:`,
										parsedBody
									);
								} catch (e) {
									console.log(
										`Raw error response for ${req.url}:`,
										responseBody
									);
								}
							});
						}
					});
				},
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@styles": path.resolve(__dirname, "./src/styles"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@assets": path.resolve(__dirname, "./src/assets"),
			"@hooks": path.resolve(__dirname, "./src/hooks"),
			"@utils": path.resolve(__dirname, "./src/utils"),
			"@context": path.resolve(__dirname, "./src/context"),
			"@pages": path.resolve(__dirname, "./src/pages"),
			"@routes": path.resolve(__dirname, "./src/routes"),
			"@store": path.resolve(__dirname, "./src/store"),
			"@services": path.resolve(__dirname, "./src/services"),
			"@constants": path.resolve(__dirname, "./src/constants"),
			"@config": path.resolve(__dirname, "./src/config"),
			"@mocks": path.resolve(__dirname, "./src/mocks"),
			"@lib": path.resolve(__dirname, "./src/lib"),
			"@middleware": path.resolve(__dirname, "./src/middleware"),
			"@api": path.resolve(__dirname, "./src/api"),
			"@schemas": path.resolve(__dirname, "./src/schemas"),
			"@forms": path.resolve(__dirname, "./src/components/forms"),
		},
	},
});
