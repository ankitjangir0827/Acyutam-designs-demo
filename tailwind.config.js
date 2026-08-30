/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./residential.html",
    "./commercial.html",
    "./industrial.html",
    "./assembly.html",
    "./careers.html",
    "./business.html",
    "./*.{js,html}"
  ],
  theme: {
    extend: {
      colors: {
        'cream': '#fff4d6',
        'cream-dark': '#ccbf99',
        'golden': '#a68150',
        'green': '#60735c',
        'pine-green': '#2e3a26',
        'vanilla': '#fdfbef',
        'sand': '#f4f0db',
        'dark-grey': '#3c3c3c',
        'grey': '#979797',
        'light-grey': '#dcdcdc',
        'navy': '#314759',
        'accent': '#e7fd55',
        'bg-dark': '#20271f'
      },
      fontFamily: {
        editorial: ['PPEditorialOld', 'Georgia', 'serif'],
        work: ['"Work Sans"', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        italiana: ['Italiana', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        'sans-clean': ['"Plus Jakarta Sans"', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
