import { defineConfig } from '@craigmiller160/js-config/configs/vite/vite.config.mjs';

export default defineConfig({
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
    }
});