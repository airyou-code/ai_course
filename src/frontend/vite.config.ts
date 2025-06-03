import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'stats.html',
      open: true, // сразу откроет в браузере
      gzipSize: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    outDir: 'dist',
    assetsDir: 'static',
    rollupOptions: {
      output: {
        /**
         * manualChunks allows to split specific modules into separate chunks.
         * Here we group some big libraries into their own chunks.
         */
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom')) {
              return 'react-dom-vendor'
            }
            if (id.includes('react-i18next') || id.includes('i18next')) {
              return 'i18n-vendor'
            }
            if (id.includes('highlight.js')) {
              return 'highlightjs-vendor'
            }
            if (id.includes('micromark')) {
              return 'micromark-vendor'
            }
            if (id.includes('@tanstack/query')) {
              return 'react-query-vendor'
            }
            if (id.includes('formik')) {
              return 'formik-vendor'
            }
            if (id.includes('axios')) {
              return 'axios-vendor'
            }
            if (id.includes('lodash-es')) {
              return 'lodash-vendor'
            }
            // всё остальное из node_modules в общий vendor
            return 'vendor'
          }
        },
        // Переопределяем имена файлов выходных чанков
        assetFileNames: 'static/[name].[hash][extname]',
        chunkFileNames: 'static/[name].[hash].js',
        entryFileNames: 'static/[name].[hash].js',
      }
    },
  },
})
