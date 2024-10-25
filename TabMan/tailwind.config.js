// tailwind.config.js
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Ensure all your components are scanned for classes
  ],
  theme: {
    extend: {
      colors: {
        darkText: '#E5E7EB', // Light text for dark mode
      },
    },
  },
  plugins: [],
};
