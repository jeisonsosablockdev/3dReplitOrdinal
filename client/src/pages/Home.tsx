import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { COLLECTIONS } from '@/lib/constants';
import StatsCard from '@/components/shared/StatsCard';
import { useTheme } from '@/lib/context/ThemeContext';

const Home = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  // Use first collection for the stats display
  const collection = COLLECTIONS[0];
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">{t('home.title')}</h1>
        <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-2xl mx-auto`}>
          {t('home.subtitle')}
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/mint">
            <Button className="bg-primary hover:bg-amber-500 text-black px-6 py-3 rounded-md font-medium text-lg">
              {t('home.getStarted')}
              <i className="ri-arrow-right-line ml-2"></i>
            </Button>
          </Link>
          <Link href="/explorer">
            <Button 
              variant="outline" 
              className={`
                px-6 py-3 rounded-md font-medium text-lg
                ${theme === 'dark' 
                  ? 'border-gray-700 hover:bg-gray-800' 
                  : 'border-gray-300 hover:bg-gray-100'
                }
              `}
            >
              {t('home.learnMore')}
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Main Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className={`
          p-6 rounded-lg border
          ${theme === 'dark' ? 'bg-surface border-gray-800' : 'bg-white border-gray-200'}
        `}>
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <i className="ri-upload-cloud-2-line text-2xl text-primary"></i>
          </div>
          <h3 className="text-xl font-bold mb-2">Upload Your Ordinal</h3>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Simply upload your existing Ordinal from a supported collection.
            Our system validates ownership and collection membership.
          </p>
        </div>
        
        <div className={`
          p-6 rounded-lg border
          ${theme === 'dark' ? 'bg-surface border-gray-800' : 'bg-white border-gray-200'}
        `}>
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <i className="ri-3d-cube-sphere-line text-2xl text-primary"></i>
          </div>
          <h3 className="text-xl font-bold mb-2">Generate 3D Version</h3>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Our advanced algorithms transform your 2D Ordinal into a stunning 3D model
            with high-quality textures and details.
          </p>
        </div>
        
        <div className={`
          p-6 rounded-lg border
          ${theme === 'dark' ? 'bg-surface border-gray-800' : 'bg-white border-gray-200'}
        `}>
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <i className="ri-quill-pen-line text-2xl text-primary"></i>
          </div>
          <h3 className="text-xl font-bold mb-2">Mint on BSV Blockchain</h3>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Inscribe your new 3D Ordinal onto the BSV blockchain with 
            secure wallet authentication and transaction verification.
          </p>
        </div>
        
        <div className={`
          p-6 rounded-lg border
          ${theme === 'dark' ? 'bg-surface border-gray-800' : 'bg-white border-gray-200'}
        `}>
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <i className="ri-gallery-line text-2xl text-primary"></i>
          </div>
          <h3 className="text-xl font-bold mb-2">View in 3D Gallery</h3>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Showcase your 3D Ordinals in our interactive gallery. Rotate, zoom,
            and explore your collection from any angle.
          </p>
        </div>
      </div>
      
      {/* Collection Stats */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-4 text-center">Collection Statistics</h2>
        <StatsCard collection={collection} />
      </div>
      
      {/* CTA Section */}
      <div className={`
        p-8 rounded-lg text-center mb-16 border
        ${theme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-gray-50 border-gray-200'
        }
      `}>
        <h2 className="text-2xl font-bold mb-4">Ready to Create Your 3D Ordinal?</h2>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6 max-w-lg mx-auto`}>
          Connect your wallet, upload your Ordinal, and transform it into a stunning 3D asset on the BSV blockchain.
        </p>
        <Link href="/mint">
          <Button className="bg-primary hover:bg-amber-500 text-black px-6 py-3 rounded-md font-medium">
            Start Minting Now
            <i className="ri-arrow-right-line ml-2"></i>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
