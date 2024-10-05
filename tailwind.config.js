module.exports = {
  theme: {
    extend: {
      colors: {
        background: {
          light: 'var(--background-light)',
          dark: 'var(--background-dark)',
          contrast: 'var(--background-contrast)',
        },
      },
    },
  },
  variants: {},
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
  ],
}
