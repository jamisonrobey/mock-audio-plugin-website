module.exports = {
  mode: 'jit',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'], // remove unused styles in production
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        background: '#0A0F12',
        acccent: '#C9C9C9',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
