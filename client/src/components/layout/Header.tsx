import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/shared/LanguageSelector';
import ConnectWalletButton from '@/components/shared/ConnectWalletButton';
import ConnectWalletModal from '@/components/shared/ConnectWalletModal';
import ThemeToggle from '@/components/shared/ThemeToggle';

const Header = () => {
  const { t } = useTranslation();
  
  return (
    <header className="border-gray-800 border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="text-primary font-bold text-xl flex items-center">
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" fill="currentColor"/>
              <path d="M12 7V5M12 19V17M5 12H7M17 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {t('common.appName')}
          </div>
          <span className="bg-gray-700 text-xs px-2 py-1 rounded">
            {t('common.beta')}
          </span>
        </div>
        
        <div className="flex items-center">
          <div className="mr-4 flex">
            <button className="bg-surface hover:bg-gray-700 rounded-md px-3 py-1 text-sm flex items-center mr-2">
              <i className="ri-earth-line mr-1"></i>
              <span>{t('common.network')}</span>
            </button>
            <LanguageSelector />
            <ThemeToggle />
          </div>
          
          <ConnectWalletButton />
        </div>
      </div>
      <ConnectWalletModal />
    </header>
  );
};

export default Header;
