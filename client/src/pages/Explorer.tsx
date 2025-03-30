import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/lib/constants';
import { Ordinal, ThreeDOrdinal } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import ThreeDViewer from '@/components/shared/ThreeDViewer';
import { useTheme } from '@/lib/context/ThemeContext';
import { useWallet } from '@/lib/context/WalletContext';
import { Link } from 'wouter';

const Explorer = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { wallet } = useWallet();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('recent');
  
  // Fetch recent inscriptions
  const { data: recentOrdinals, isLoading: isLoadingRecent } = useQuery({
    queryKey: [`${API_ENDPOINTS.GET_ORDINAL}recent`],
    queryFn: async () => {
      const response = await fetch(`${API_ENDPOINTS.GET_ORDINAL}recent`);
      if (!response.ok) {
        throw new Error('Failed to fetch recent ordinals');
      }
      const data = await response.json();
      return data.data as ThreeDOrdinal[];
    },
  });
  
  // Fetch user's ordinals if wallet is connected
  const { data: userOrdinals, isLoading: isLoadingUser } = useQuery({
    queryKey: [`${API_ENDPOINTS.GET_ORDINAL}user`, wallet.address],
    queryFn: async () => {
      const response = await fetch(`${API_ENDPOINTS.GET_ORDINAL}user/${wallet.address}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user ordinals');
      }
      const data = await response.json();
      return data.data as ThreeDOrdinal[];
    },
    enabled: !!wallet.address,
  });
  
  // Search ordinals
  const { data: searchResults, isLoading: isLoadingSearch } = useQuery({
    queryKey: [`${API_ENDPOINTS.GET_ORDINAL}search`, searchQuery],
    queryFn: async () => {
      const response = await fetch(`${API_ENDPOINTS.GET_ORDINAL}search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Failed to search ordinals');
      }
      const data = await response.json();
      return data.data as ThreeDOrdinal[];
    },
    enabled: searchQuery.length > 2,
  });
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActiveTab('search');
  };
  
  const renderOrdinalCard = (ordinal: ThreeDOrdinal) => (
    <div 
      key={ordinal.id} 
      className={`
        rounded-lg overflow-hidden border
        ${theme === 'dark' ? 'bg-surface border-gray-800' : 'bg-white border-gray-200'}
      `}
    >
      <div className="aspect-square relative">
        <ThreeDViewer 
          modelUrl={ordinal.modelUrl} 
          showControls={false}
        />
        <Link href={`/preview/${ordinal.originalOrdinalId}`}>
          <Button
            className="absolute bottom-2 right-2 bg-primary/80 hover:bg-primary text-black text-xs px-2 py-1 rounded"
          >
            <i className="ri-eye-line mr-1"></i>
            View
          </Button>
        </Link>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-sm">
              {ordinal.collection.name}
            </h3>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              #{ordinal.inscriptionNumber}
            </p>
          </div>
          <div 
            className={`
              text-xs px-1.5 py-0.5 rounded
              ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}
            `}
          >
            3D
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderOrdinalGrid = (ordinals: ThreeDOrdinal[] | undefined, isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className={`
                rounded-lg overflow-hidden border animate-pulse
                ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}
              `}
            >
              <div className="aspect-square"></div>
              <div className="p-3">
                <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (!ordinals || ordinals.length === 0) {
      return (
        <div className={`
          text-center py-12 rounded-lg border
          ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}
        `}>
          <i className={`ri-inbox-line text-5xl ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} mb-3`}></i>
          <p className="font-medium">No ordinals found</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            {activeTab === 'user' ? 'Connect your wallet or mint your first 3D Ordinal' : 'Try adjusting your search'}
          </p>
          {activeTab === 'user' && !wallet.connected && (
            <Button
              className="mt-4 bg-primary hover:bg-amber-500 text-black"
              onClick={() => window.dispatchEvent(new CustomEvent('open-wallet-modal'))}
            >
              <i className="ri-wallet-3-line mr-2"></i>
              {t('header.connect')}
            </Button>
          )}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {ordinals.map(renderOrdinalCard)}
      </div>
    );
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Title */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{t('explorer.title')}</h1>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Browse and explore 3D Ordinals on the BSV blockchain
        </p>
      </div>
      
      {/* Search */}
      <div className={`
        p-4 mb-8 rounded-lg border
        ${theme === 'dark' ? 'bg-surface border-gray-800' : 'bg-white border-gray-200'}
      `}>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder={t('explorer.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}
          />
          <Button 
            type="submit" 
            className="bg-primary hover:bg-amber-500 text-black"
          >
            <i className="ri-search-line mr-2"></i>
            {t('explorer.search')}
          </Button>
        </form>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="recent" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <TabsList className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}>
            <TabsTrigger value="recent" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              {t('explorer.recent')}
            </TabsTrigger>
            <TabsTrigger value="user" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              {t('explorer.owned')}
            </TabsTrigger>
            {searchQuery.length > 0 && (
              <TabsTrigger value="search" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                Search Results
              </TabsTrigger>
            )}
          </TabsList>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className={theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}
            >
              <i className="ri-filter-3-line mr-1"></i>
              {t('explorer.filter')}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}
            >
              <i className="ri-sort-desc-line mr-1"></i>
              {t('explorer.sortBy')}
            </Button>
          </div>
        </div>
        
        <TabsContent value="recent">
          {renderOrdinalGrid(recentOrdinals, isLoadingRecent)}
        </TabsContent>
        
        <TabsContent value="user">
          {renderOrdinalGrid(userOrdinals, isLoadingUser)}
        </TabsContent>
        
        <TabsContent value="search">
          {renderOrdinalGrid(searchResults, isLoadingSearch)}
        </TabsContent>
      </Tabs>
      
      {/* Collections */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{t('explorer.collections')}</h2>
          <Button variant="link" className="text-primary">
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Collection card */}
          <div className={`
            rounded-lg overflow-hidden border relative group
            ${theme === 'dark' ? 'bg-surface border-gray-800' : 'bg-white border-gray-200'}
          `}>
            <div className="aspect-video bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
              <img 
                src="https://mint-sites.s3.amazonaws.com/foxes/yellow-fox.png" 
                alt="Pixel Foxes" 
                className="h-24 w-24 object-contain" 
              />
            </div>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button className="bg-primary hover:bg-amber-500 text-black">
                View Collection
              </Button>
            </div>
            <div className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Pixel Foxes 3D</h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    2,716 items
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explorer;
