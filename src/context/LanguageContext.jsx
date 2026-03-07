import { createContext, useContext, useState } from 'react'
import { translations, t as translate } from '../translations/translations.js'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')

  function toggle() {
    setLang(prev => prev === 'en' ? 'zh' : 'en')
  }

  function t(key) {
    return translate(translations, lang, key)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
