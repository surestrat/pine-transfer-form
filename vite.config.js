import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		// Email middleware plugin removed - will be implemented later
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@styles": path.resolve(__dirname, "./src/styles"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@forms": path.resolve(__dirname, "./src/components/forms"),
			"@ui": path.resolve(__dirname, "./src/components/ui"),
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
