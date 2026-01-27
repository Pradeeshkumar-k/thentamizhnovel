import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  changeLanguage: (_lang: Language) => void;
  isTamil: boolean;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Default to Tamil
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'tamil';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  const value = {
    language,
    changeLanguage,
    isTamil: language === 'tamil',
    isEnglish: language === 'english'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
