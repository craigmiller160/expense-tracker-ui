import path from 'path';
import solidPlugin from 'vite-plugin-solid';
import fs from 'fs';

export default {
	root: path.join(process.cwd(), 'src'),
	server: {
		port: 3002,
		host: true,
		https: {
			cert: fs.readFileSync(
				path.join(process.cwd(), 'dev', 'certs', 'localhost.cert.pem'),
				'utf8'
			),
			key: fs.readFileSync(
				path.join(process.cwd(), 'dev', 'certs', 'localhost.key.pem'),
				'utf8'
			)
		},
		proxy: {
			'/expense-tracker/api': {
				target: 'https://localhost:8080',
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/expense-tracker\/api/, ''),
				logLevel: 'debug'
			},
			'/expense-tracker/oauth2': {
				target: 'https://localhost:7003',
				changeOrigin: true,
				secure: false,
				rewrite: (path) =>
					path.replace(/^\/expense-tracker\/oauth2/, ''),
				logLevel: 'debug'
			}
		}
	},
	plugins: [solidPlugin()],
	build: {
		target: 'esnext'
	}
};
