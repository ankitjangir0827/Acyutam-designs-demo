/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./*.html",
    "./public/*.html",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "surface": "#131313",
        "surface-dim": "#131313",
        "surface-bright": "#3a3939",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-low": "#1c1b1b",
        "surface-container": "#201f1f",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353534",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#d5c4ab",
        "outline": "#9e8f78",
        "outline-variant": "#514532",
        "surface-tint": "#ffba20",
        "primary": "#ff7722",
        "on-primary": "#412d00",
        "primary-container": "#ffb800",
        "on-primary-container": "#6b4c00",
        "secondary": "#c3c7cd",
        "on-secondary": "#2c3136",
        "secondary-container": "#454a4f",
        "on-secondary-container": "#b4b9bf",
        "tertiary": "#ffdac0",
        "background": "#131313",
        "on-background": "#e5e2e1"
      },
      fontFamily: {
        "display-lg": ["Playfair Display", "serif"],
        "headline-xl": ["Playfair Display", "serif"],
        "headline-md": ["Playfair Display", "serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "label-caps": ["Space Mono", "monospace"]
      }
    }
  },
  plugins: []
};
