module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html'
  ],
  darkMode: 'class',
  safelist: [
    'lg:translate-x-0',
    'lg:static',
    'lg:h-screen',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
      }
    }
  },
  plugins: []
};
