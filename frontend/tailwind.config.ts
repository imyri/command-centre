import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./widgets/**/*.{ts,tsx}", "./workspace/**/*.{ts,tsx}", "./productivity/**/*.{ts,tsx}"],
  theme: {
    extend: {}
  },
  plugins: []
} satisfies Config;

