import en from '../locales/en-US.json'
import ro from '../locales/ro-RO.json'

export default defineI18nConfig(() => {
  return {
    legacy: false,
    messages: {
      en,
      ro,
    },
    fallbackLocale: 'en',
    locale: 'en',
  }
})
