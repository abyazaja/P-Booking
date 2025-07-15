module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ballwhite: '#f9f9f9',
        ballblack: '#222',
        ballgreen: '#1abc60',
        ballorange: '#ff7f11',
        ballgray: '#e5e7eb',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'ping-slow': 'ping 3s infinite',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(26, 188, 96, 0.3)',
        'glow-orange': '0 0 20px rgba(255, 127, 17, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(26, 188, 96, 0.1)',
      },
    },
  },
  plugins: [],
}
