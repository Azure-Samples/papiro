module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#A855F7',
          50: '#D5C1F6',
          100: '#C9AFF4',
          200: '#B18BEE',
          300: '#9967E9',
          400: '#8144E4',
          500: '#6920DF',
          600: '#5419B3',
          700: '#3F1386 ',
          800: '#2A0D59',
          900: '#15062D'
        },
        gray: {
          DEFAULT: '#556987',
          50: '#F7F8F9',
          100: '#EEF0F3',
          200: '#D5DAE1',
          300: '#BBC3CF',
          400: '#8896AB',
          500: '#556987',
          600: '#4D5F7A',
          700: '#404F65',
          800: '#333F51',
          900: '#2A3342'
        },
        info: {
          DEFAULT: '#3B82F6',
          50: '#F5F9FF',
          100: '#EBF3FE',
          200: '#CEE0FD',
          300: '#B1CDFB',
          400: '#76A8F9',
          500: '#3B82F6',
          600: '#3575DD',
          700: '#2C62B9',
          800: '#234E94',
          900: '#1D4079'
        },
        danger: {
          500: '#EF5944'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
};
