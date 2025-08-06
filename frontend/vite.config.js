import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    server: {
        host: '0.0.0.0',     // Cho phép truy cập từ ngoài container
        port: 5173,
        strictPort: true,
        watch: {
            usePolling: true, //Cần thiết trong Docker để Vite theo dõi file
        },
        hmr: {
            host: 'localhost', // Nếu không chạy Docker trên localhost (VD: WSL2), hãy đổi thành IP máy thật
            port: 5173,
        },
        proxy: {
            // proxy /uploads từ Vite dev -> nginx host (trên host máy dev)
            '/uploads': {
                target: 'http://localhost:5173', // lưu ý: đây là host máy dev
                changeOrigin: true,
                secure: false,
            }
        }
    },
    plugins: [react()],
})
