import path from 'path';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import { defineConfig } from 'vite';

const https =
	process.env.CYPRESS === 'true'
		? undefined
		: {
				cert: fs.readFileSync(
					path.join(
						process.cwd(),
						'dev',
						'certs',
						'localhost.cert.pem'
					),
					'utf8'
				),
				key: fs.readFileSync(
					path.join(
						process.cwd(),
						'dev',
						'certs',
						'localhost.key.pem'
					),
					'utf8'
				)
		  };

export default defineConfig({
	root: path.join(process.cwd(), 'src'),
	base: '/expense-tracker/',
	publicDir: path.join(process.cwd(), 'public'),
	envDir: path.join(process.cwd(), 'environment'),
	optimizeDeps: {
		exclude: ['fp-ts']
	},
	server: {
		port: 3002,
		host: true,
		https,
		proxy: {
			'/expense-tracker/api': {
				target: 'https://localhost:8080',
				changeOrigin: true,
				secure: false,
				rewrite: (path: string) =>
					path.replace(/^\/expense-tracker\/api/, '')
			},
			'/expense-tracker/oauth2': {
				target: 'https://apps-craigmiller160.ddns.net/oauth2',
				changeOrigin: true,
				secure: false,
				rewrite: (path: string) =>
					path.replace(/^\/expense-tracker\/oauth2/, '')
			}
		}
	},
	plugins: [react()],
	build: {
		target: 'esnext',
		outDir: path.join(process.cwd(), 'build'),
		emptyOutDir: true
	}
});
