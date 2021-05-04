import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

const resources = {
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
      falblackLng: 'en',
      resources,
      keySeparator: false,
      interpolation: {
          escapeValue: false
      }
  })

export default i18n
