import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

import { resolve } from 'path';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
})
