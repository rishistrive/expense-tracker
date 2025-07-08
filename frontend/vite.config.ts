
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  preview: {
 
    allowedHosts: ['expense-tracker-1-0iev.onrender.com'],
  },
});
