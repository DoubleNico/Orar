// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    [
      '@nuxtjs/color-mode',
      {
        fallback: 'light', // fallback value if not system preference found
      },
    ],
    '@nuxtjs/i18n',
  ],

  css: ['~/assets/css/tailwind.css'],

  typescript: {
    shim: false,
  },

  i18n: {
    vueI18n: './nuxt-i18n.ts',
    locales: [
      {
        code: 'en',
        name: 'English',
      },
      {
        code: 'ro',
        name: 'Romanian',
      },
    ],
    lazy: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    defaultLocale: 'en',
  },

  app: {
    head: {
      charset: 'utf-16',
      viewport: 'width=500, initial-scale=1',
      title: 'Nuxt JS + Tailwind CSS',
      meta: [
        {
          name: 'description',
          content: 'A cool website with support for ESLINT and Prettier',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: 'https://raw.githubusercontent.com/nuxt/nuxt.js/master/.github/nuxt.png',
        },
      ],
    },
  },
  compatibilityDate: '2024-10-05',
  nitro: {
    storage: {
      redis: {
        driver: 'redis',
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
      },
    },
  },
  runtimeConfig: {
    public: {
      backend: process.env.BACKEND,
      api_link: process.env.API_LINK,
      schedule_link: process.env.SCHEDULE_LINK,
    },
  },
})
