import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n from 'i18next';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  changeLanguage: (language: Language) => void;
}

// Create a default context value
const defaultContextValue: LanguageContextType = {
  language: 'en',
  changeLanguage: () => console.log('LanguageProvider not initialized')
};

const LanguageContext = createContext<LanguageContextType>(defaultContextValue);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      // Check for saved language preference or use browser language
      const savedLanguage = localStorage.getItem('language') as Language | null;
      if (savedLanguage) {
        return savedLanguage;
      }
      
      // Check browser language
      const browserLanguage = navigator.language.split('-')[0];
      return (browserLanguage === 'es') ? 'es' : 'en';
    } catch (error) {
      console.error('Failed to determine language:', error);
      // Default to English
      return 'en';
    }
  });

  useEffect(() => {
    try {
      // Save language preference
      localStorage.setItem('language', language);
      
      // Apply language
      i18n.changeLanguage(language);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  }, [language]);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  return useContext(LanguageContext);
};
