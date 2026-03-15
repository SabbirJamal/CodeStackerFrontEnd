import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        oman: {
          red: '#D32F2F',
          green: '#2E7D32',
          white: '#FFFFFF',
          gold: '#FFB300',
          desert: '#EDC9AF',
          sea: '#0288D1',
        },
      },
    },
  },
  plugins: [],
}

export default config