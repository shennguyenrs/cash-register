import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import resourcesToBackend from "i18next-resources-to-backend"
import { initReactI18next } from "react-i18next"

i18n
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`),
    ),
  )
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    defaultNS: "home",
    ns: ["home", "menu_section", "preview_order_section", "report"],
    interpolation: {
      escapeValue: false,
    },
    debug: false,
    react: {
      useSuspense: false, // Disable suspense to prevent loading issues
    },
  })

export default i18n
