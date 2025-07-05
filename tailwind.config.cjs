/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      translate: {
        'full': '100%',
        '-full': '-100%',
      },
      colors: {
        "neon-blue": "#00FFFF",
        "neon-green": "#39FF14",
        "neon-pink": "#FF4AFF",
      },
      boxShadow: {
        "neon-blue-glow": "0 0 20px #00FFFF",
        "neon-green-glow": "0 0 20px #39FF14",
        "neon-pink-glow": "0 0 20px #FF4AFF",
      },
    },
  },
  plugins: [],
};
