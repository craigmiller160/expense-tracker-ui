import { defineConfig } from 'cypress';

export default defineConfig({
	screenshotOnRunFailure: true,
	video: false,
	component: {
		devServer: {
			framework: 'react',
			bundler: 'vite'
		}
	},
	experimentalFetchPolyfill: true,
	e2e: {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		setupNodeEvents(on, config) {
			// implement node event listeners here
		}
	}
});
