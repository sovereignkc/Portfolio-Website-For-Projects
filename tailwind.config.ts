import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#070707",
        panel: "#101010",
        panel2: "#151515",
        line: "rgba(255,255,255,0.09)",
        ink: "rgba(255,255,255,0.94)",
        muted: "rgba(255,255,255,0.66)",
        soft: "rgba(255,255,255,0.48)",
        accent: {
          50: "#f4f0ff",
          400: "#9f7aea",
          500: "#8b5cf6",
          600: "#7c3aed"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(0,0,0,0.45)"
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at top, rgba(139,92,246,0.14), transparent 32%), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
      },
      backgroundSize: {
        "grid-lg": "100% 100%, 36px 36px, 36px 36px"
      }
    }
  },
  plugins: []
};

export default config;
