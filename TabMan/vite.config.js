import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),  // Popup HTML
        background: resolve(__dirname, 'background.js'),  // Background script
      },
      output: {
        entryFileNames: 'assets/[name].js',  // Ensure all files are outputted to assets
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
