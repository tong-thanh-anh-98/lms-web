import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    server: {
        host: '0.0.0.0', // Allow access from outside the container
        port: 5173,      // internal dev server port (container)
        strictPort: true,
        watch: {
            usePolling: true, // Required in Docker
        },
        hmr: {
            host: 'localhost', // client should connect to host machine
            port: 9173,        // host port we mapped: 9173
        },

        // Proxy API Laravel
        proxy: {
            '/api': {
                target: 'http://web', // service nginx
                changeOrigin: true,
                secure: false,
            },
            '/uploads': {
                target: 'http://web', // for ReactPlayer to load video via nginx
                changeOrigin: true,
                secure: false,
            },
            '/save-lesson-video': {
                target: 'http://web',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    plugins: [react()],
})
