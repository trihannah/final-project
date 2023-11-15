/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      colors: {
        'custom-beige': '#F0F0EB',
        'custom-green': '#325D37',
      },
    },
    plugins: [require('daisyui')],
  },
};
