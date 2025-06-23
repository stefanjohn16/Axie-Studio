import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Language, SUPPORTED_LANGUAGES } from '../types/language';
import { translations } from '../data/translations';
import { useNavigate, useLocation } from 'react-router-dom';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string>, defaultValue?: string | string[] | any) => string | string[] | any;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get language from URL
  const getLanguageFromURL = (): Language => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const langCode = pathParts[0];
    
    if (langCode && langCode.length === 2) {
      const found = SUPPORTED_LANGUAGES.find(lang => lang.code === langCode);
      if (found) return found;
    }
    
    return SUPPORTED_LANGUAGES[0]; // Default to Swedish
  };

  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    // First try URL
    const urlLang = getLanguageFromURL();
    if (urlLang.code !== SUPPORTED_LANGUAGES[0].code) {
      return urlLang;
    }
    
    // Then try localStorage
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage) {
      const found = SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage);
      if (found) return found;
    }
    
    // Then try browser language
    const browserLang = navigator.language.split('-')[0];
    const detected = SUPPORTED_LANGUAGES.find(lang => lang.code === browserLang);
    
    return detected || SUPPORTED_LANGUAGES[0]; // Default to Swedish
  });

  // Translation function with proper fallback chain
  const t = useCallback((key: string, params?: Record<string, string>, defaultValue?: string | string[] | any): string | string[] | any => {
    const keys = key.split('.');
    
    // Try current language first
    let value = getNestedValue(translations[currentLanguage.code], keys);
    
    // If not found, try English
    if (value === undefined && currentLanguage.code !== 'en') {
      value = getNestedValue(translations['en'], keys);
    }
    
    // If still not found, try Swedish
    if (value === undefined && currentLanguage.code !== 'sv') {
      value = getNestedValue(translations['sv'], keys);
    }
    
    // If still not found, use default or key
    if (value === undefined) {
      console.warn(`Translation missing for key: ${key} in language: ${currentLanguage.code}`);
      return defaultValue !== undefined ? defaultValue : key;
    }
    
    // Handle arrays and objects
    if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
      return value;
    }
    
    // Replace parameters in string
    if (params && typeof value === 'string') {
      return Object.entries(params).reduce((str, [param, replacement]) => {
        return str.replace(new RegExp(`{{${param}}}`, 'g'), replacement);
      }, value);
    }
    
    return value;
  }, [currentLanguage.code]);

  // Helper function to get nested values
  const getNestedValue = (obj: any, keys: string[]): any => {
    return keys.reduce((current, key) => {
      return current && typeof current === 'object' ? current[key] : undefined;
    }, obj);
  };

  const setLanguage = useCallback((language: Language) => {
    console.log('🌍 Language: Switching to', language.name, `(${language.code})`);
    
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language.code);
    
    // Update document attributes
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.rtl ? 'rtl' : 'ltr';
    
    // Update URL
    const currentPath = location.pathname;
    const pathParts = currentPath.split('/').filter(Boolean);
    
    // Remove existing language code if present
    if (pathParts.length > 0 && SUPPORTED_LANGUAGES.some(lang => lang.code === pathParts[0])) {
      pathParts.shift();
    }
    
    // Add new language code
    const newPath = `/${language.code}${pathParts.length > 0 ? '/' + pathParts.join('/') : ''}${location.search}${location.hash}`;
    
    navigate(newPath, { replace: true });
    
    // Trigger custom event
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: language.code } 
    }));
  }, [navigate, location]);

  // Update language when URL changes
  useEffect(() => {
    const urlLanguage = getLanguageFromURL();
    if (urlLanguage.code !== currentLanguage.code) {
      setCurrentLanguage(urlLanguage);
      localStorage.setItem('preferred-language', urlLanguage.code);
      document.documentElement.lang = urlLanguage.code;
      document.documentElement.dir = urlLanguage.rtl ? 'rtl' : 'ltr';
    }
  }, [location.pathname]);

  // Set initial document attributes
  useEffect(() => {
    document.documentElement.lang = currentLanguage.code;
    document.documentElement.dir = currentLanguage.rtl ? 'rtl' : 'ltr';
    
    // Add language class to body for CSS targeting
    document.body.className = document.body.className.replace(/\blang-\w+\b/g, '');
    document.body.classList.add(`lang-${currentLanguage.code}`);
    
    console.log(`🌍 Language: Active language is ${currentLanguage.name} (${currentLanguage.code})`);
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      t,
      isRTL: currentLanguage.rtl || false
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};