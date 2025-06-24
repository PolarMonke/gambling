import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en.json';
import beTranslations from './locales/be.json';
import chTranslations from './locales/ch.json';
import frTranslations from './locales/fr.json';
import itTranslations from './locales/it.json';
import jpTranslations from './locales/jp.json';
import plTranslations from './locales/pl.json';
import spTranslations from './locales/sp.json';
import psTranslations from './locales/ps.json';
import gyTranslations from './locales/gy.json';

const initI18n = i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      be: { translation: beTranslations },
      ch: { translation: chTranslations },
      fr: { translation: frTranslations },
      it: { translation: itTranslations },
      jp: { translation: jpTranslations },
      pl: { translation: plTranslations },
      sp: { translation: spTranslations },
      ps: { translation: psTranslations },
      gy: { translation: gyTranslations }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;