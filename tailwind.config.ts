import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#24130c",
        brand: "#d9480f",
        cream: "#fff8ed"
      }
    }
  },
  plugins: []
};

export default config;
