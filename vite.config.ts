/// <reference types="vitest" />
import { defineConfig } from '@craigmiller160/js-config/configs/vite/vite.config.mjs';
import path from 'path';

export default defineConfig({
	base: '/expense-tracker/',
	server: {
		port: 3002,
		proxy: {
			'/expense-tracker/api': {
				target: 'https://localhost:8080',
				changeOrigin: true,
				secure: false,
				rewrite: (path: string) =>
					path.replace(/^\/expense-tracker\/api/, '')
			}
		}
	},
	test: {
		environment: 'jsdom',
		setupFiles: [path.join(process.cwd(), 'test', 'setup.tsx')]
	}
});
