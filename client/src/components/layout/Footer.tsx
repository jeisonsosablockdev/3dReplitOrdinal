import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { COPYRIGHT_YEAR } from '@/lib/constants';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-surface border-gray-800 mt-16 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-primary font-bold text-xl flex items-center mb-4">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" fill="currentColor"/>
                <path d="M12 7V5M12 19V17M5 12H7M17 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {t('common.appName')}
            </div>
            <p className="text-gray-400 text-sm mb-4">
              {t('footer.description')}
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="ri-twitter-x-line text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="ri-github-fill text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="ri-discord-line text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="ri-telegram-line text-lg"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">{t('footer.resources')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white">{t('footer.documentation')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">{t('footer.apiReference')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">{t('footer.systemStatus')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">{t('footer.developerGuide')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white">{t('footer.aboutUs')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">{t('footer.careers')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">{t('footer.blog')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">{t('footer.contact')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white">{t('footer.termsOfService')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">{t('footer.privacyPolicy')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">{t('footer.cookiePolicy')}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-gray-800 border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            {t('footer.copyright', { year: COPYRIGHT_YEAR })}
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-xs">{t('footer.poweredBy')}</span>
            <span className="text-xs font-medium">{t('footer.blockchain')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
