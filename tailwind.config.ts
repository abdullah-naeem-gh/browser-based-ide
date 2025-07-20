// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',      // For App Router
    './pages/**/*.{js,ts,jsx,tsx}',    // If you're using Pages too
    './components/**/*.{js,ts,jsx,tsx}' // Your components
  ],
  theme: {
    extend: {}, // you can add custom colors, fonts etc. here
  },
  plugins: [],
}
export default config
