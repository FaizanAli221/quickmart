import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Core token system — a grocery/mandi-inspired palette, not the
        // default terracotta-on-cream AI-generated look.
        brand: {
          DEFAULT: "#2F7A4D", // deep spinach green
          dark: "#20623A",
          light: "#E6F2EA",
        },
        chili: {
          DEFAULT: "#E8622C", // chili-orange CTA accent
          dark: "#C94E1D",
        },
        mango: {
          DEFAULT: "#F2B705", // deal/badge accent
        },
        ink: "#1B2B22", // near-black text with a green undertone
        paper: "#F7F6F1", // warm rice-white background
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Inter", "sans-serif"],
        display: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
