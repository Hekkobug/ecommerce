/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./public/index.html",
  ],
  theme: {
    fontFamily:{
      main: ['Mulish', 'sans-serif;']
    },
    extend: {
      width: {
        main: '1220px'
      },
      backgroundColor: {
        main: '#9321ea',
        overlay:'rgba(0,0,0,0.3)'
      },
      colors: {
        main: '#9321ea'
      },
      flex: {
        '2': '2 2 0%',
        '3': '3 3 0%',
        '4': '4 4 0%',
        '5': '5 5 0%',
        '6': '6 6 0%',
        '7': '7 7 0%',
      },
      keyframes: {
        'slide-top':{
          '0%': {
            '-webkit-transform': 'translateY(20px)',
                    transform: 'translateY(20px)'
          },
          '100%': {
            '-webkit-transform': 'translateY(0)',
                    transform: 'translateY(0)'
          }
        },
        'slide-top-sm':{
          '0%': {
            '-webkit-transform': 'translateY(8px)',
                    transform: 'translateY(20px)'
          },
          '100%': {
            '-webkit-transform': 'translateY(0)',
                    transform: 'translateY(0)'
          }
        },
         'slide-right': {
          '0%': {
            '-webkit-transform': 'translateX(-5000px)',
                    transform: 'translateX(-5000px)'
          },
          '100%': {
            '-webkit-transform': 'translateX(0)',
                    transform: 'translateX(0)'
          }
        },
        "scale-up-center": {
          '0%': {
            '-webkit-transform': 'scale(0.5)',
                    transform: 'scale(0.5)'
          },
          '100%': {
            '-webkit-transform': 'scale(1)',
                    transform: 'scale(1)'
          }
        }
        
      },
      animation:{
        'slide-top': 'animation: slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
        'slide-top-sm': 'animation: slide-top-sm 0.2s linear both;',
        'slide-right': 'slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
        'scale-up-center':'scale-up-center 0.15s cubic-bezier(0.390, 0.575, 0.565, 1.000) both'
      }
    },
  },
  listStyleType: {
      none: 'none',
      disc: 'disc',
      decimal: 'decimal',
      square: 'square',
      roman: 'upper-roman',
    },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require('@tailwindcss/forms'),
  ],
}