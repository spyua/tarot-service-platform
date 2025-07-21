import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
// @ts-ignore - Import CommonJS module
import imageOptimizationPlugin from './vite-plugins/imageOptimization';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      babel: {
        plugins: [
          // Add any babel plugins if needed
        ],
      },
    }),
    imageOptimizationPlugin({
      // Configure image optimization
      include: /\.(png|jpe?g|gif)$/,
      exclude: /node_modules/,
      sizes: {
        small: 300,
        medium: 600,
        large: 1000,
      },
      formats: ['webp', 'original'],
      quality: 85,
      outputDir: 'dist/images',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/pages': resolve(__dirname, 'src/pages'),
      '@/hooks': resolve(__dirname, 'src/hooks'),
      '@/services': resolve(__dirname, 'src/services'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/types': resolve(__dirname, 'src/types'),
      '@/data': resolve(__dirname, 'src/data'),
      '@/styles': resolve(__dirname, 'src/styles'),
      '@/assets': resolve(__dirname, 'src/assets'),
    },
  },
  server: {
    port: 3000,
    open: true,
    host: true,
    cors: true,
    // Enable HMR
    hmr: {
      overlay: true,
    },
  },
  preview: {
    port: 4173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development',
    minify: 'terser',
    target: 'es2020',
    cssCodeSplit: true,
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          vendor: ['react', 'react-dom'],
          // Router functionality
          router: ['react-router-dom'],
          // Animation library
          animation: ['framer-motion'],
          // Utility functions (will be populated as we add more utilities)
          utils: [],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: assetInfo => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (
            /\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')
          ) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return `assets/fonts/[name]-[hash].${ext}`;
          }
          if (/\.css$/i.test(assetInfo.name || '')) {
            return `assets/css/[name]-[hash].${ext}`;
          }
          return `assets/[ext]/[name]-[hash].${ext}`;
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production',
        pure_funcs:
          process.env.NODE_ENV === 'production' ? ['console.log'] : [],
      },
      mangle: {
        safari10: true,
      },
    },
    // Enable CSS minification
    cssMinify: true,
    // Report compressed file sizes
    reportCompressedSize: true,
    // Emit manifest for better caching
    manifest: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
    exclude: [],
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
  },
  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      // Add any CSS preprocessor options if needed
    },
  },
  // Enable esbuild for faster builds
  esbuild: {
    target: 'es2020',
    logOverride: {
      'this-is-undefined-in-esm': 'silent',
    },
  },
});
