import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f1a17",
        brand: "#d9480f",
        cream: "#fff7ed"
      }
    }
  },
  plugins: []
};

export default config;
