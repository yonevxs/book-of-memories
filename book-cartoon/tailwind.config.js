/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dream-bg': '#f3e8ff',     
        'dream-paper': '#fffbf0',  
        'dream-purple': '#c084fc', 
        'dream-dark': '#6b21a8',   
        'soft-pink': '#fbcfe8',    
      },
      fontFamily: {
        // MUDANÇA AQUI: Usando Montserrat para o título principal
        'title': ['"Montserrat"', 'sans-serif'], 
        // Mantendo a fonte cursiva para os títulos internos das páginas
        'hand-title': ['"Dancing Script"', 'cursive'],
        'hand': ['"Indie Flower"', 'cursive'],
        'yellowtail': ['"Yellowtail"', 'cursive'],
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(107, 33, 168, 0.5)', 
        'inner-page': 'inset 20px 0 50px rgba(0,0,0,0.05)', 
      }
    },
  },
  plugins: [],
}