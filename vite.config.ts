import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "node:path";

export default defineConfig({
    plugins: [react()],
    css: {
        devSourcemap: true
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@fonts': path.resolve(__dirname, './src/assets/fonts'),
        },
    },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true
        }
    },
    server: {
        allowedHosts: true
    }
})
