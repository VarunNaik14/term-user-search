/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {  

    fontFamily: {
      sans: [
        '"Inter var", font-mono',
        {
          fontFeatureSettings: '"cv11", "ss01"',
          fontVariationSettings: '"opsz" 32'
        },
      ],
    },
  
      extend: {
        container: {
  
        },
        colors: {
          black: '000000',
          lightblue: '0040A5',
          white: 'FCFCFC',
          gray: '938BA1',
          darkblue: '1D00A5',
    
    
        } ,
        gridTemplateRows: {
          '8': 'repeat(8, minmax(0, 1fr))',
  
          'layout': '200px minmax(900px, 1fr) 100px',
        }
      },
    },
  plugins: [],
};

