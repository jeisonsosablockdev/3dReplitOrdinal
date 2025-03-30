import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import MintingSteps from '@/components/shared/MintingSteps';
import OrdinalUploader from '@/components/shared/OrdinalUploader';
import ValidationStatus from '@/components/shared/ValidationStatus';
import StatsCard from '@/components/shared/StatsCard';
import { COLLECTIONS } from '@/lib/constants';
import { useOrdinalValidation } from '@/lib/hooks/useOrdinalValidation';
import { useTheme } from '@/lib/context/ThemeContext';

const Mint = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { theme } = useTheme();
  
  // Use first collection for now
  const collection = COLLECTIONS[0];
  
  const { 
    file, 
    isValidating, 
    validateOrdinal, 
    validationResult 
  } = useOrdinalValidation(collection.id);
  
  const handleFileSelected = async (selectedFile: File) => {
    await validateOrdinal(selectedFile);
  };
  
  const handleContinue = () => {
    if (validationResult?.valid && validationResult.ordinal) {
      // Navigate to preview page with ordinal ID
      setLocation(`/preview/${validationResult.ordinal.id}`);
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
      <MintingSteps currentStep={1} />

      {/* Minting Card Container */}
      <div className={`
        rounded-xl overflow-hidden border shadow-lg
        ${theme === 'dark' ? 'bg-surface border-gray-800' : 'bg-white border-gray-200'}
      `}>
        {/* Card Header */}
        <div className={`
          border-b px-6 py-4 flex justify-between items-center
          ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}
        `}>
          <h2 className="text-xl font-bold">{t('mint.uploadOrdinal')}</h2>
          <div className="flex items-center space-x-2 text-sm">
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
              {t('mint.selectCollection')}
            </span>
            <span className="font-medium">
              {collection.name}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          {/* Ordinal Uploader */}
          <OrdinalUploader 
            collection={collection} 
            onFileSelected={handleFileSelected} 
          />
          
          {/* Validation Status */}
          <ValidationStatus 
            isValidating={isValidating} 
            validationResult={validationResult} 
          />

          {/* Button Row */}
          <div className="flex justify-between items-center mt-8">
            <Button 
              variant="ghost" 
              className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} px-4 py-2 rounded-md flex items-center`}
              onClick={() => setLocation('/')}
            >
              <i className="ri-arrow-left-line mr-2"></i>
              {t('common.back')}
            </Button>
            
            <Button 
              className={`
                px-6 py-3 rounded-md font-medium
                ${validationResult?.valid 
                  ? 'bg-primary hover:bg-amber-500 text-black' 
                  : theme === 'dark' 
                    ? 'bg-gray-700 text-gray-400' 
                    : 'bg-gray-200 text-gray-500'
                }
              `}
              disabled={!validationResult?.valid}
              onClick={handleContinue}
            >
              {t('common.continue')}
              <i className="ri-arrow-right-line ml-2"></i>
            </Button>
          </div>
        </div>
      </div>

      {/* Collection Statistics */}
      <StatsCard collection={collection} />
    </div>
  );
};

export default Mint;
