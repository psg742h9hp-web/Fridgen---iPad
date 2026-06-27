/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      spacing: {
        "safe-area": "max(1rem, env(safe-area-inset-bottom))",
      },
      fontSize: {
        "emoji-lg": "3rem",
        "emoji-xl": "4rem",
      },
      minHeight: {
        "touch-target": "60px",
      },
      minWidth: {
        "touch-target": "60px",
      },
    },
  },
  plugins: [],
};
