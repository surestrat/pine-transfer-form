import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		// Copy polyfills and utility scripts to build output
		{
			name: 'copy-utils',
			enforce: 'post',
			apply: 'build',
			generateBundle() {
				// These files will be copied to dist/src/utils/
				const utilFiles = [
					'browser-detector.js',
					'icon-polyfill.js',
					'ie-polyfills.js'
				];
				
				utilFiles.forEach(file => {
					this.emitFile({
						type: 'asset',
						fileName: `src/utils/${file}`,
						source: fs.readFileSync(`src/utils/${file}`, 'utf-8')
					});
				});
			}
		}
	],
	build: {
		sourcemap: false, // Disable source maps in production to avoid errors
		minify: 'terser', // Use terser for better minification
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom'],
					axios: ['axios']
				}
			}
		}
	},
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
		},
	},
});
