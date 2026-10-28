import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        janm: {
          dark: "#08090C",
          surface: "#10131B",
          surfaceLight: "#181D29",
          border: "#252D3D",
          borderGold: "rgba(212, 175, 55, 0.3)",
          gold: "#D4AF37",
          goldLight: "#F59E0B",
          goldMuted: "#B89635",
          goldHover: "#E5BE42",
          white: "#FFFFFF",
          muted: "#94A3B8"
        }
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F59E0B 0%, #D4AF37 50%, #996515 100%)",
        "gold-glow": "radial-gradient(circle at center, rgba(212, 175, 55, 0.15) 0%, transparent 70%)",
        "dark-radial": "radial-gradient(ellipse at top, #141A28 0%, #08090C 100%)"
      },
      boxShadow: {
        "gold-sm": "0 0 10px rgba(212, 175, 55, 0.15)",
        "gold-md": "0 0 20px rgba(212, 175, 55, 0.25)",
        "gold-lg": "0 0 35px rgba(212, 175, 55, 0.35)",
      }
    },
  },
  plugins: [],
};
export default config;
