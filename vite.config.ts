import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
	base: '/Curricularizacao-2026-2/',
	plugins: [react(), tailwindcss()],
})
