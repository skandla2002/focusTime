import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './locales/en/translation.json'
import ko from './locales/ko/translation.json'
import zh from './locales/zh/translation.json'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ko: { translation: ko },
      zh: { translation: zh },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ko', 'zh'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'navigator'],
      caches: [],
    },
  })

export default i18n
