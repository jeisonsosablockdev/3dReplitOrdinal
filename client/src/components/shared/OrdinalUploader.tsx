import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Collection } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/context/ThemeContext';

interface OrdinalUploaderProps {
  collection?: Collection;
  onFileSelected: (file: File) => void;
}

const OrdinalUploader = ({ collection, onFileSelected }: OrdinalUploaderProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
  };
  
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="mb-8">
      <div className="mb-4">
        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
          {t('mint.yourOrdinal')}
        </label>
        <div className="flex items-start space-x-4">
          {/* Left: Ordinal Upload */}
          <div className="flex-1">
            <div 
              className={`
                border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
                ${isDragging 
                  ? 'border-primary' 
                  : theme === 'dark' ? 'border-gray-700 hover:border-primary' : 'border-gray-300 hover:border-primary'
                }
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
            >
              <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center">
                <i className={`ri-upload-cloud-2-line text-5xl ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}></i>
              </div>
              <p className="text-sm mb-2">{t('mint.dragAndDrop')}</p>
              <button 
                className={`
                  rounded-md px-4 py-2 text-sm inline-flex items-center
                  ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
                `}
              >
                <i className="ri-folder-upload-line mr-2"></i>
                {t('mint.browseFiles')}
              </button>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} mt-3`}>
                {t('mint.supportedFormats')}
              </p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/png,image/jpeg,image/jpg,image/gif" 
                onChange={handleFileChange} 
              />
            </div>
          </div>

          {/* Right: Ordinal Info */}
          {collection && (
            <div className={`w-1/3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-4`}>
              <h3 className="font-medium mb-2 text-sm">{t('mint.requiredCollection')}</h3>
              <div className="flex items-center mb-4">
                <img 
                  src={collection.sampleImage} 
                  alt={collection.name} 
                  className="w-12 h-12 rounded mr-3" 
                />
                <div>
                  <h4 className="font-medium">{collection.name}</h4>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>ID: {collection.collectionId}</p>
                </div>
              </div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <p className="mb-2">• {t('mint.validationInstructions.onlyFrom', { collection: collection.name })}</p>
                <p>• {t('mint.validationInstructions.mustOwn')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdinalUploader;
