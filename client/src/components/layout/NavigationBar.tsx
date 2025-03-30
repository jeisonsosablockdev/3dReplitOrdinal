import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';

const NavigationBar = () => {
  const { t } = useTranslation();
  const [location] = useLocation();
  
  const navLinks = [
    { path: '/', label: t('navigation.home') },
    { path: '/explorer', label: t('navigation.explorer') },
    { path: '/mint', label: t('navigation.mint') },
    { path: '/marketplace', label: t('navigation.marketplace') },
  ];
  
  return (
    <nav className="bg-surface border-gray-800 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {navLinks.map((link) => {
            const isActive = location === link.path;
            return (
              <Link 
                key={link.path} 
                href={link.path}
                className={`
                  px-4 py-3 font-medium text-sm whitespace-nowrap
                  ${isActive 
                    ? 'text-white border-b-2 border-primary' 
                    : 'text-gray-400 hover:text-white'
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
