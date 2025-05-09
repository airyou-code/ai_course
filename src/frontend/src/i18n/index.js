/**
 * Initialize i18next using your own cookie helpers and browser language fallback.
 * - Reads language from DB (if available), then from your cookie via readCookie
 * - Falls back to browser’s navigator.language (only 'en' or 'ru')
 * - Defaults to 'en'
 * - Does not use i18next-browser-languagedetector (handled manually)
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import ru from './locales/ru/translation.json';

import { LANGUAGE } from '../config/cookies';
import { readCookie, setCookie } from '../utils/cookie';

/**
 * @returns {'en'|'ru'}
 * Determine initial language:
 * 1. From your app’s user state (e.g. loaded from DB)
 * 2. From cookie via readCookie(LANGUAGE)
 * 3. From navigator.language ('ru' or 'en' only)
 * 4. Default to 'en'
 */
function getInitialLanguage() {
  // 1. From your app (e.g. currentUser.language)
  const dbLang = window.currentUser?.language; 
  if (dbLang === 'ru' || dbLang === 'en') {
    return dbLang;
  }

  // 2. From cookie
  const cookieLang = readCookie(LANGUAGE);
  if (cookieLang === 'ru' || cookieLang === 'en') {
    return cookieLang;
  }

  // 3. From browser
  const browserLang = (navigator.language || 'en').split('-')[0];
  if (browserLang === 'ru' || browserLang === 'en') {
    return browserLang;
  }

  // 4. Default
  return 'en';
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'],
    interpolation: { escapeValue: false },
  });

export default i18n;
