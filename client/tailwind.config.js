/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F0F7F4',
          100: '#DCEFE4',
          200: '#B5DFC7',
          500: '#2E8B65',
          700: '#1B7A55',
          800: '#116B4C',
          900: '#0B4D36',
        },
        terracotta: {
          50: '#FDF4EF',
          100: '#FBE6DA',
          500: '#E66B2E',
          600: '#CD561B',
          700: '#B04310',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FFFDF9',
          200: '#FFF9EE',
          300: '#F8F1E2',
          400: '#EDE4D0',
        },
        honey: {
          100: '#FEF7E0',
          200: '#FDEBB3',
          300: '#F4D68A',
          400: '#E8BF5C',
        },
        graphite: {
          50: '#F8FAF9',
          100: '#E9EFEA',
          200: '#D3DFD7',
          600: '#4A5B53',
          800: '#26332D',
          900: '#161F1B',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
