import { useLanguage } from '@/lib/context/LanguageContext';

const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();
  
  const handleLanguageChange = () => {
    changeLanguage(language === 'en' ? 'es' : 'en');
  };
  
  return (
    <button
      onClick={handleLanguageChange}
      className="rounded-md px-3 py-1 text-sm flex items-center mr-2 bg-surface hover:bg-gray-700"
    >
      <i className="ri-translate-2 mr-1"></i>
      <span>{language.toUpperCase()}</span>
    </button>
  );
};

export default LanguageSelector;
