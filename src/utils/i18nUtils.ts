import { SUPPORTED_LANGUAGES } from '../types/language';

/**
 * Get browser language with fallback
 */
export const getBrowserLanguage = (): string => {
  // Try to get the full language code first
  const fullLang = navigator.language;
  const shortLang = fullLang.split('-')[0];
  
  // Check if we support the full language code
  if (SUPPORTED_LANGUAGES.some(lang => lang.code === fullLang)) {
    return fullLang;
  }
  
  // Check if we support the short language code
  if (SUPPORTED_LANGUAGES.some(lang => lang.code === shortLang)) {
    return shortLang;
  }
  
  // Default to Swedish
  return 'sv';
};

/**
 * Validate if a language code is supported
 */
export const isValidLanguageCode = (code: string): boolean => {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
};

/**
 * Get language object by code
 */
export const getLanguageByCode = (code: string) => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || SUPPORTED_LANGUAGES[0];
};

/**
 * Format numbers according to locale
 */
export const formatNumber = (number: number, locale: string): string => {
  try {
    return new Intl.NumberFormat(locale).format(number);
  } catch (error) {
    console.warn(`Failed to format number for locale ${locale}:`, error);
    return number.toString();
  }
};

/**
 * Format dates according to locale
 */
export const formatDate = (date: Date, locale: string, options?: Intl.DateTimeFormatOptions): string => {
  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    console.warn(`Failed to format date for locale ${locale}:`, error);
    return date.toLocaleDateString();
  }
};

/**
 * Format currency according to locale
 */
export const formatCurrency = (amount: number, currency: string, locale: string): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  } catch (error) {
    console.warn(`Failed to format currency for locale ${locale}:`, error);
    return `${amount} ${currency}`;
  }
};

/**
 * Get RTL languages
 */
export const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

/**
 * Check if language is RTL
 */
export const isRTLLanguage = (code: string): boolean => {
  return RTL_LANGUAGES.includes(code);
};

/**
 * Get translation key suggestions for missing keys
 */
export const getTranslationKeySuggestions = (missingKey: string, availableKeys: string[]): string[] => {
  const suggestions: string[] = [];
  const keyParts = missingKey.split('.');
  
  availableKeys.forEach(key => {
    if (key.startsWith(keyParts[0])) {
      suggestions.push(key);
    }
  });
  
  return suggestions.slice(0, 5); // Return top 5 suggestions
};

/**
 * Log missing translation keys in development
 */
export const logMissingTranslation = (key: string, language: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🌍 Missing Translation`);
    console.warn(`Key: ${key}`);
    console.warn(`Language: ${language}`);
    console.warn(`Please add this key to /src/data/translations/${language}.ts`);
    console.groupEnd();
  }
};

/**
 * Validate translation object structure
 */
export const validateTranslationStructure = (translation: any, referenceTranslation: any, path = ''): string[] => {
  const errors: string[] = [];
  
  for (const key in referenceTranslation) {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (!(key in translation)) {
      errors.push(`Missing key: ${currentPath}`);
      continue;
    }
    
    const refValue = referenceTranslation[key];
    const transValue = translation[key];
    
    if (typeof refValue === 'object' && refValue !== null && !Array.isArray(refValue)) {
      if (typeof transValue !== 'object' || transValue === null || Array.isArray(transValue)) {
        errors.push(`Type mismatch at ${currentPath}: expected object, got ${typeof transValue}`);
      } else {
        errors.push(...validateTranslationStructure(transValue, refValue, currentPath));
      }
    }
  }
  
  return errors;
};