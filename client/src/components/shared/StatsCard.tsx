import { useTranslation } from 'react-i18next';
import { Collection } from '@/lib/types';
import { useTheme } from '@/lib/context/ThemeContext';

interface StatsCardProps {
  collection: Collection;
}

const StatsCard = ({ collection }: StatsCardProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  const percentage = Math.round((collection.minted / collection.maxSupply) * 100 * 100) / 100;
  const remaining = collection.maxSupply - collection.minted;
  
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className={`
        rounded-lg p-4 border
        ${theme === 'dark' ? 'bg-surface border-gray-800' : 'bg-white border-gray-200'}
      `}>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
          {t('mint.statistics.maxSupply')}
        </p>
        <p className="text-2xl font-bold">{collection.maxSupply.toLocaleString()}</p>
      </div>
      
      <div className={`
        rounded-lg p-4 border
        ${theme === 'dark' ? 'bg-surface border-gray-800' : 'bg-white border-gray-200'}
      `}>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
          {t('mint.statistics.remaining')}
        </p>
        <p className="text-2xl font-bold">{remaining.toLocaleString()}</p>
      </div>
      
      <div className={`
        rounded-lg p-4 border
        ${theme === 'dark' ? 'bg-surface border-gray-800' : 'bg-white border-gray-200'}
      `}>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
          {t('mint.statistics.minted')}
        </p>
        <p className="text-2xl font-bold">{percentage}%</p>
      </div>
      
      <div className={`
        rounded-lg p-4 border
        ${theme === 'dark' ? 'bg-surface border-gray-800' : 'bg-white border-gray-200'}
      `}>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
          {t('mint.statistics.mintFee')}
        </p>
        <p className="text-2xl font-bold">
          {collection.mintFee.toLocaleString()} <span className="text-sm">{t('mint.statistics.sats')}</span>
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
