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
		target: 'es2015', // Target older browsers for better compatibility
		chunkSizeWarningLimit: 1000, // Increase warning limit to 1000kb since we have survey library
		// Reduce memory usage during build
		reportCompressedSize: false, // Skip compressed size reporting to save memory
		rollupOptions: {
			// Reduce parallelization to use less memory
			maxParallelFileOps: 2,
			output: {
				manualChunks: (id) => {
					// Split large vendor libraries into separate chunks
					if (id.includes('node_modules')) {
						// React and React DOM in their own chunk
						if (id.includes('react') || id.includes('react-dom')) {
							return 'react-vendor';
						}
						// Survey.js library (likely large) - split into smaller pieces
						if (id.includes('survey-core')) {
							return 'survey-core-vendor';
						}
						if (id.includes('survey-react-ui')) {
							return 'survey-ui-vendor';
						}
						// Framer Motion (animation library)
						if (id.includes('framer-motion')) {
							return 'animation-vendor';
						}
						// React Query
						if (id.includes('@tanstack/react-query')) {
							return 'query-vendor';
						}
						// Router
						if (id.includes('react-router')) {
							return 'router-vendor';
						}
						// Axios and other HTTP libraries
						if (id.includes('axios')) {
							return 'http-vendor';
						}
						// Tailwind and styling
						if (id.includes('tailwind') || id.includes('@tailwind')) {
							return 'styles-vendor';
						}
						// Lucide icons
						if (id.includes('lucide-react')) {
							return 'icons-vendor';
						}
						// Zustand state management
						if (id.includes('zustand')) {
							return 'state-vendor';
						}
						// Zod validation
						if (id.includes('zod')) {
							return 'validation-vendor';
						}
						// All other vendor libraries
						return 'vendor';
					}
					
					// Split your app code by feature
					if (id.includes('/pages/')) {
						return 'pages';
					}
					if (id.includes('/components/surveyjs/')) {
						return 'survey-components';
					}
					if (id.includes('/components/forms/')) {
						return 'form-components';
					}
					if (id.includes('/components/ui/')) {
						return 'ui-components';
					}
					if (id.includes('/components/')) {
						return 'components';
					}
					if (id.includes('/services/')) {
						return 'services';
					}
					if (id.includes('/store/')) {
						return 'store';
					}
					if (id.includes('/utils/')) {
						return 'utils';
					}
				},
				// Optimize chunk file names
				chunkFileNames: 'assets/[name]-[hash].js',
				entryFileNames: 'assets/[name]-[hash].js',
				assetFileNames: 'assets/[name]-[hash].[ext]'
			}
		},
		// Enable tree shaking for better dead code elimination
		terserOptions: {
			compress: {
				drop_console: true, // Remove console logs in production
				drop_debugger: true,
				pure_funcs: ['console.log', 'console.warn'], // Remove specific console functions
				passes: 1 // Reduce to single pass to save memory
			},
			mangle: {
				safari10: true // Better compatibility
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
