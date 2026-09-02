import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Configuration Vite : active le plugin React pour le serveur de dev et le build.
export default defineConfig({
  plugins: [react()],
})
