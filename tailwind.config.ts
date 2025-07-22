import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  // @ts-expect-error – daisyui is not in the Tailwind types but still valid
  daisyui: {
    themes: ['light', 'dark', 'synthwave'],
    base: true,
    styled: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: '',
  },
}

export default config
