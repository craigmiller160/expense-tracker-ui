import path from 'path';
import solidPlugin from 'vite-plugin-solid';

export default {
	root: path.join(process.cwd(), 'src'),
	server: {
		port: 3002
	},
	plugins: [solidPlugin()],
	build: {
		target: 'esnext'
	}
};
