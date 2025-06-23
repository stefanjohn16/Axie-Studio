export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export interface Translation {
  [key: string]: string | string[] | Translation | any;
}

export interface Translations {
  [languageCode: string]: Translation;
}

// Only Swedish and English
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' }
];