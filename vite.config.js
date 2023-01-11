import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        globals: true, // required
        setupFiles: ['vitest-localstorage-mock'],
    },
    build: {
        outDir: './docs'
    }
})