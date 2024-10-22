import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: './',
    root: './src',
    publicDir: '../public',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        target: browserslistToEsbuild(),
        cssTarget: browserslistToEsbuild(),
    },
    css: {
        postcss: {
            plugins: [autoprefixer()],
        },
    },
});