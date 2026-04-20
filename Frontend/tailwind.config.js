/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "fluid-h1": "clamp(1.8rem, 4vw, 3rem)",
        "fluid-h2": "clamp(1.5rem, 3vw, 2.2rem)",
        "fluid-h3": "clamp(1.2rem, 2.5vw, 1.8rem)",
        "fluid-p": "clamp(1rem, 1.5vw, 1.2rem)",
        "fluid-small": "clamp(0.8rem, 1vw, 1rem)",
      },
    },
  },
  plugins: [],
};
