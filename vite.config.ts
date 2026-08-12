import {svelte} from '@sveltejs/vite-plugin-svelte';
import {playwright} from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import {defineConfig} from 'vitest/config';
import solid from 'vite-plugin-solid';

const customElementTags = [
  'omni-todo',
  'omni-entry',
  'omni-checkbox',
  'omni-delete-button',
  'omni-add-button',
  'omni-input'
];

const solidFiles = ['src/add-button/**'];
const preactFiles = ['src/input/**'];

export default defineConfig({
  base: '/omni-todo/',
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true
      }
    }),
    vue({
      customElement: true,
      template: {
        compilerOptions: {
          isCustomElement: (tag) => customElementTags.includes(tag)
        }
      }
    }),
    solid({include: solidFiles}),
    react({exclude: [...solidFiles, ...preactFiles]})
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{browser: 'chromium'}]
    },
    coverage: {
      provider: 'v8'
    }
  }
});
