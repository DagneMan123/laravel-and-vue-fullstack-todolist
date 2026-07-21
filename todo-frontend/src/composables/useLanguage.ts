import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { setLanguage, getLanguage } from '@/i18n'

export const useLanguage = () => {
  const i18n = useI18n()

  const currentLanguage = computed(() => {
    if (i18n.locale && typeof i18n.locale === 'object') {
      return i18n.locale.value
    }
    return (i18n as any).locale || 'en'
  })

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  ] as const

  const switchLanguage = (lang: 'en' | 'am') => {
    setLanguage(lang)
  }

  const getLanguageName = (code: string) => {
    const lang = languages.find(l => l.code === code)
    return lang?.nativeName || code
  }

  return {
    currentLanguage,
    languages,
    switchLanguage,
    getLanguageName,
  }
}
