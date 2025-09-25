import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // ...autres options...
  server: {
    host: '0.0.0.0',
    watch: {
      usePolling: true,
    },
  },
});