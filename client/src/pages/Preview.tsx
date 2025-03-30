import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import MintingSteps from '@/components/shared/MintingSteps';
import ThreeDViewer from '@/components/shared/ThreeDViewer';
import { useOrdinalById } from '@/lib/hooks/useOrdinalValidation';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/lib/constants';
import { ThreeDOrdinal } from '@/lib/types';
import { useTheme } from '@/lib/context/ThemeContext';

const Preview = () => {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { theme } = useTheme();
  
  // Fetch original ordinal
  const { data: ordinal, isLoading: isLoadingOrdinal } = useOrdinalById(params.id);
  
  // Fetch generated 3D model
  const { data: threeDOrdinal, isLoading: isLoading3D } = useQuery({
    queryKey: [API_ENDPOINTS.GENERATE_3D, params.id],
    queryFn: async () => {
      const response = await fetch(`${API_ENDPOINTS.GENERATE_3D}/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to generate 3D model');
      }
      const data = await response.json();
      return data.data as ThreeDOrdinal;
    },
    enabled: !!ordinal,
  });
  
  const isLoading = isLoadingOrdinal || isLoading3D;
  
  const handleBack = () => {
    setLocation('/mint');
  };
  
  const handleContinue = () => {
    if (threeDOrdinal) {
      setLocation(`/mint-confirm/${params.id}`);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{t('home.title')}</h1>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('home.subtitle')}
        </p>
      </div>

      {/* Minting Steps */}
      <MintingSteps currentStep={2} />

      {/* Preview Card */}
      <div className={`
        rounded-xl overflow-hidden border shadow-lg
        ${theme === 'dark' ? 'bg-surface border-gray-800' : 'bg-white border-gray-200'}
      `}>
        <div className={`
          border-b px-6 py-4 flex justify-between items-center
          ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}
        `}>
          <h2 className="text-xl font-bold">{t('preview.title')}</h2>
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              className={`
                text-sm px-3 py-1 rounded flex items-center
                ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
              `}
            >
              <i className="ri-fullscreen-line mr-1"></i>
              {t('preview.fullscreen')}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
          {/* Left: Original Ordinal */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                {t('preview.originalOrdinal')}
              </h3>
              <div className={`
                rounded-lg overflow-hidden aspect-square flex items-center justify-center
                ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}
              `}>
                {isLoading ? (
                  <div className="animate-pulse w-full h-full bg-gray-700"></div>
                ) : ordinal ? (
                  <img 
                    src={ordinal.content} 
                    alt={`Ordinal #${ordinal.inscriptionNumber}`}
                    className="max-w-full max-h-full" 
                  />
                ) : (
                  <div className="text-center p-4">
                    <i className="ri-error-warning-line text-4xl text-red-500 mb-2"></i>
                    <p>Ordinal not found</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <h4 className="font-medium mb-2">{t('preview.ordinalDetails')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    {t('preview.collection')}
                  </span>
                  <span>{ordinal?.collection.name || '...'}</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    {t('preview.inscriptionNumber')}
                  </span>
                  <span className="font-mono">{ordinal?.inscriptionNumber || '...'}</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    {t('preview.owner')}
                  </span>
                  <span className="font-mono text-xs truncate w-32">
                    {ordinal?.owner 
                      ? `${ordinal.owner.slice(0, 6)}...${ordinal.owner.slice(-4)}` 
                      : '...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right: 3D Preview */}
          <div className="md:col-span-3">
            <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              {t('preview.threeDPreview')}
            </h3>
            
            <ThreeDViewer 
              modelUrl={threeDOrdinal?.modelUrl} 
              className="mb-4"
              showControls={true}
            />
            
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <h4 className="font-medium mb-2">{t('preview.modelDetails')}</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1>
                    {t('preview.polygons')}
                  </p>
                  <p>{threeDOrdinal?.polygonCount || '...'}</p>
                </div>
                <div>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1>
                    {t('preview.textureResolution')}
                  </p>
                  <p>{threeDOrdinal?.textureResolution || '...'}</p>
                </div>
                <div>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1>
                    {t('preview.fileSize')}
                  </p>
                  <p>~{threeDOrdinal ? (threeDOrdinal.fileSize / 1024 / 1024).toFixed(1) : '...'} MB</p>
                </div>
                <div>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1>
                    {t('preview.format')}
                  </p>
                  <p>{threeDOrdinal?.format || '...'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Button Row */}
        <div className={`
          border-t p-6 flex justify-between items-center
          ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}
        `}>
          <Button 
            variant="ghost" 
            className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} px-4 py-2 rounded-md flex items-center`}
            onClick={handleBack}
          >
            <i className="ri-arrow-left-line mr-2"></i>
            {t('common.back')}
          </Button>
          
          <Button 
            className="bg-primary hover:bg-amber-500 text-black px-6 py-3 rounded-md font-medium flex items-center"
            onClick={handleContinue}
            disabled={isLoading || !threeDOrdinal}
          >
            {t('preview.continueToMint')}
            <i className="ri-arrow-right-line ml-2"></i>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Preview;
