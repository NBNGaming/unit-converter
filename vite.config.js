import { defineConfig } from 'vite';

export default defineConfig({
    base: '',
    test: {
        globals: true, // required
        setupFiles: ['vitest-localstorage-mock'],
    },
    build: {
        outDir: './docs'
    }
})