/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      colors: {
        'custom-beige': '#F5F5F0',
        'custom-green': '#325D37',
        'lavender-100': '#f0edf5',
        'lavender-200': '#e6e0ee',
        'lavender-300': '#d2c7e0',
        'lavender-400': '#beaed2',
        'green-101': '#b8c8ae',
      },
    },
    plugins: [require('daisyui')],
  },
};
