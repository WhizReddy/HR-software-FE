import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

const vendorChunkMap = [
  {
    name: 'react-vendor',
    packages: ['react', 'react-dom', 'scheduler'],
  },
  {
    name: 'router-vendor',
    packages: ['react-router-dom', '@remix-run/router'],
  },
  {
    name: 'query-vendor',
    packages: ['@tanstack'],
  },
  {
    name: 'form-vendor',
    packages: [
      'react-hook-form',
      '@hookform/resolvers',
      'valibot',
      '@tanstack/react-form',
      '@tanstack/valibot-form-adapter',
    ],
  },
  {
    name: 'ui-vendor',
    packages: [
      '@base-ui/react',
      'class-variance-authority',
      'clsx',
      'embla-carousel-react',
      'lucide-react',
      'sonner',
      'tailwind-merge',
      'vaul',
    ],
  },
  {
    name: 'charts-vendor',
    packages: ['recharts'],
  },
  {
    name: 'drag-vendor',
    packages: ['react-beautiful-dnd'],
  },
  {
    name: 'maps-vendor',
    packages: ['@react-google-maps/api'],
  },
]

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          for (const chunk of vendorChunkMap) {
            if (chunk.packages.some((pkg) => id.includes(pkg))) {
              return chunk.name
            }
          }

          return 'vendor'
        },
      },
    },
  },
})

