/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f2f6fa',
          100: '#e1edf4',
          200: '#cbe0eb',
          300: '#a5ccdd',
          400: '#75aecc',
          500: '#5393b9',
          600: '#417aa1',
          700: '#356285',
          800: '#2e526d',
          900: '#2457a3', /* Deep Navy */
        },
        primary: {
          DEFAULT: '#2457a3',
          light: '#4A7BCD',
          dark: '#153B75',
        }
      },
      animation: {
        blob: "blob 7s infinite",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  plugins: [],
}

