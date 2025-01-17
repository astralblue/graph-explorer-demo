const defaultTheme = require('tailwindcss/defaultTheme');

const config = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
  ],

  plugins: [require('flowbite/plugin')],

  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['DM Sans', 'sans-serif', ...defaultTheme.fontFamily.sans],
      serif: ['Studio', 'sans-serif', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      fontSize: {
        '2xs': '0.625rem',
      },
      colors: {
        // flowbite-svelte
        primary: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
    },
  },
};

module.exports = config;
