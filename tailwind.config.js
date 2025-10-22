/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: "#3BE0FF",
          pink: "#FF4DFF",
          violet: "#8A7CFF"
        }
      },
      boxShadow: {
        neon: "0 0 10px rgba(59,224,255,0.6), 0 0 30px rgba(138,124,255,0.25)"
      }
    }
  },
  plugins: []
}
