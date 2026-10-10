import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#140821",
        deep: "#2A0E4A",
        deeper: "#1D0A33",
        accent: {
          from: "#8B2FD1",
          via: "#B336C2",
          to: "#D946A8",
          DEFAULT: "#9B3FD9",
        },
        ink: {
          DEFAULT: "#F5F1FB",
          muted: "#B39FD1",
          faint: "#7C6A99",
        },
        glass: {
          DEFAULT: "rgba(255,255,255,0.06)",
          border: "rgba(255,255,255,0.14)",
          strong: "rgba(255,255,255,0.10)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      backgroundImage: {
        "aurora-gradient":
          "radial-gradient(120% 120% at 15% 0%, #4A1B7A 0%, #2A0E4A 45%, #140821 100%)",
        "accent-gradient": "linear-gradient(135deg, #8B2FD1 0%, #C13FBE 55%, #D946A8 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(20, 8, 33, 0.45)",
        glow: "0 0 60px rgba(155, 63, 217, 0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "hero-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "hero-glow": {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.65", transform: "scale(1.06)" },
        },
        "hero-kenburns": {
          "0%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1.12)" },
        },
        "hero-slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "hero-float": "hero-float 6s ease-in-out infinite",
        "hero-glow": "hero-glow 5s ease-in-out infinite",
        "hero-kenburns": "hero-kenburns 18s ease-in-out infinite alternate",
        "hero-slide-up": "hero-slide-up 0.7s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
