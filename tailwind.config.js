/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "neon-green": "#00ff41",
        "dark-bg": "#0a0a0a",
        "darker-bg": "#050505",
        "card-bg": "#1a1a1a",
        "border-dark": "#333333",
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        glow: {
          "0%": {
            boxShadow: "0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 15px #00ff41",
          },
          "100%": {
            boxShadow: "0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41",
          },
        },
      },
    },
  },
  plugins: [],
};
