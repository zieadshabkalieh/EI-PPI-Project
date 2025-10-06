import { en } from '../data/locales/en.js';
import { es } from '../data/locales/es.js';
import { zh } from '../data/locales/zh.js';
import { fr } from '../data/locales/fr.js';
import { ja } from '../data/locales/ja.js';

// Available languages - Top 10 world languages
// We've implemented English, Spanish, Chinese, French, and Japanese so far
// Placeholder objects for other languages - these would be replaced with actual translations
const hi = {}; // Hindi
const ar = {}; // Arabic
const pt = {}; // Portuguese
const ru = {}; // Russian
const de = {}; // German

// Available languages with proper names
const languages = {
  en, // English
  es, // Spanish
  zh, // Chinese
  hi, // Hindi
  ar, // Arabic
  pt, // Portuguese 
  fr, // French
  ru, // Russian
  ja, // Japanese
  de  // German
};

// Language display names
export const languageNames = {
  en: "English",
  es: "Español",
  zh: "中文",
  hi: "हिन्दी",
  ar: "العربية",
  pt: "Português",
  fr: "Français",
  ru: "Русский",
  ja: "日本語",
  de: "Deutsch"
};

// Current language (default to English)
let currentLanguage = 'en';

// Function to get the current language
export function getCurrentLanguage() {
  return currentLanguage;
}

// Function to set the current language
export function setLanguage(languageCode) {
  if (languages[languageCode]) {
    currentLanguage = languageCode;
    localStorage.setItem('preferredLanguage', languageCode);
  } else {
    console.error(`Language ${languageCode} is not supported.`);
  }
}

// Function to translate a string
export function translate(key) {
  // Check if we have a translation for the key in the current language
  if (languages[currentLanguage] && languages[currentLanguage][key]) {
    return languages[currentLanguage][key];
  }
  
  // Fall back to English if the current language doesn't have a translation
  if (currentLanguage !== 'en' && languages.en && languages.en[key]) {
    return languages.en[key];
  }
  
  // Return the key itself if no translation is found
  return key;
}

// Callback set used for components that need to update their translations dynamically
let languageChangeCallbacks = [];

// Register a callback function to be called when the language changes
export function onLanguageChange(callback) {
  if (typeof callback === 'function' && !languageChangeCallbacks.includes(callback)) {
    languageChangeCallbacks.push(callback);
    return true;
  }
  return false;
}

// Unregister a previously registered callback
export function offLanguageChange(callback) {
  const index = languageChangeCallbacks.indexOf(callback);
  if (index !== -1) {
    languageChangeCallbacks.splice(index, 1);
    return true;
  }
  return false;
}

// Listen for language change events
if (typeof document !== 'undefined') {
  document.addEventListener('languageChanged', (event) => {
    // Notify all registered callbacks about the language change
    languageChangeCallbacks.forEach(callback => {
      try {
        callback(event.detail.language);
      } catch (error) {
        console.error('Error in language change callback:', error);
      }
    });
  });
}

// Initialize language from local storage or browser settings
export function initializeLanguage() {
  // Check if there's a preferred language in local storage
  const storedLanguage = localStorage.getItem('preferredLanguage');
  
  if (storedLanguage && languages[storedLanguage]) {
    currentLanguage = storedLanguage;
    return;
  }
  
  // If no language in local storage, use browser language if available
  const browserLanguage = navigator.language.split('-')[0]; // Get just the language code (e.g., 'en' from 'en-US')
  
  if (languages[browserLanguage]) {
    currentLanguage = browserLanguage;
    localStorage.setItem('preferredLanguage', browserLanguage);
  }
}

// Manually trigger all language change callbacks
export function refreshTranslations() {
  languageChangeCallbacks.forEach(callback => {
    try {
      callback(currentLanguage);
    } catch (error) {
      console.error('Error refreshing translations:', error);
    }
  });
}

// Initialize language settings
initializeLanguage();
