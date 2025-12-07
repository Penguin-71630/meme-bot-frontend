// File: webpage/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 確保掃描所有 src 裡面的元件檔案
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}