import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: "/Blog",
  plugins: [react()],
  server: {
    hmr: {
      overlay: false, // отключение оверлея ошибок на экране
    },
  },
  optimizeDeps: {
    force: true, // принудительная переоптимизация зависимостей
  },
});
