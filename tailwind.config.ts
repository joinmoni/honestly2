import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f8f6f2",
        ink: "#1f1d1a",
        muted: "#6f6a61",
        line: "#ddd8ce",
        card: "#fffdf8",
        brand: {
          50: "#f2f6f3",
          100: "#e4ece6",
          500: "#3f6f58",
          600: "#355f4b",
          700: "#2a4d3d"
        }
      },
      boxShadow: {
        soft: "0 12px 35px rgba(28, 26, 23, 0.08)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      fontFamily: {
        serif: ["var(--font-playfair-display)", "Georgia", "ui-serif", "Cambria", '"Times New Roman"', "Times", "serif"],
        display: ["var(--font-playfair-display)", "Georgia", "ui-serif", "serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
