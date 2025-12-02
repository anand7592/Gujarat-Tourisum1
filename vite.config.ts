import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  // Load env variables
  const env = process.env; // OR import.meta.env inside config function

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    // Build optimizations for faster loading
    build: {
      // Enable minification
      minify: 'esbuild' as const,
      // Chunk splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunk for React core
            'react-vendor': ['react', 'react-dom'],
            // Router chunk
            'router': ['react-router-dom'],
            // UI libraries chunk
            'ui-vendor': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-select',
              '@radix-ui/react-tabs',
              '@radix-ui/react-avatar',
              '@radix-ui/react-alert-dialog',
            ],
            // Form handling chunk
            'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
            // Icons chunk
            'icons': ['lucide-react'],
          },
        },
      },
      // Target modern browsers for smaller bundles
      target: 'es2020',
      // Enable source maps for production debugging (optional)
      sourcemap: false,
      // Reduce chunk size warnings threshold
      chunkSizeWarningLimit: 1000,
    },
    // Optimize dependencies pre-bundling
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'axios',
        'lucide-react',
      ],
    },
  };
});
