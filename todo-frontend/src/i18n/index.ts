import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import am from './locales/am.json'

type MessageSchema = typeof en

export const i18n = createI18n<{ message: MessageSchema }, 'en' | 'am'>({
  legacy: false, // use composition API
  locale: localStorage.getItem('language') || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    am,
  },
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false,
})

// Function to set language
export const setLanguage = (lang: 'en' | 'am') => {
  if (i18n.global.locale && typeof i18n.global.locale === 'object') {
    i18n.global.locale.value= lang
  } else {
    (i18n.global as any).locale = lang
  }
  localStorage.setItem('language', lang)
  document.documentElement.lang = lang
  if (lang === 'am') {
    document.documentElement.dir = 'ltr'
  } else {
    document.documentElement.dir = 'ltr'
  }
}

// Get current language
export const getLanguage = (): 'en' | 'am' => {
  const lang = localStorage.getItem('language') || 'en'
  return lang as 'en' | 'am'
}
