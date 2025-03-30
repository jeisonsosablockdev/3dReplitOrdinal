import { useTranslation } from 'react-i18next';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import ThreeDViewer from '@/components/shared/ThreeDViewer';
import MintingSteps from '@/components/shared/MintingSteps';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, EXPLORER_URL } from '@/lib/constants';
import { MintingTransaction, ThreeDOrdinal } from '@/lib/types';
import { useTheme } from '@/lib/context/ThemeContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const MintSuccess = () => {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Fetch 3D Ordinal
  const { data: threeDOrdinal, isLoading: isLoading3D } = useQuery({
    queryKey: [API_ENDPOINTS.GET_ORDINAL, params.id],
    queryFn: async () => {
      const response = await fetch(`${API_ENDPOINTS.GET_ORDINAL}${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch 3D ordinal');
      }
      const data = await response.json();
      return data.data as ThreeDOrdinal;
    },
    enabled: !!params.id,
  });
  
  // Fetch transaction details
  const { data: transaction } = useQuery({
    queryKey: [`${API_ENDPOINTS.MINT_3D}/transactions`, params.id],
    queryFn: async () => {
      const response = await fetch(`${API_ENDPOINTS.MINT_3D}/transactions/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transaction');
      }
      const data = await response.json();
      return data.data as MintingTransaction;
    },
    enabled: !!params.id,
  });
  
  const handleCopyTxId = () => {
    if (transaction?.transactionId) {
      navigator.clipboard.writeText(transaction.transactionId);
      setCopied(true);
      
      toast({
        title: t('common.copied'),
        description: t('mintSuccess.txIdCopied'),
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleDownload = () => {
    if (threeDOrdinal?.modelUrl) {
      // Create a link element to download the model
      const link = document.createElement('a');
      link.href = threeDOrdinal.modelUrl;
      link.download = `ordinal-3d-${threeDOrdinal.inscriptionNumber}.glb`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
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
      <MintingSteps currentStep={4} />

      {/* Success Card */}
      <div className={`
        rounded-xl overflow-hidden border shadow-lg
        ${theme === 'dark' ? 'bg-surface border-gray-800' : 'bg-white border-gray-200'}
      `}>
        <div className={`
          border-b px-6 py-4
          ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}
        `}>
          <h2 className="text-xl font-bold">{t('mintSuccess.title')}</h2>
        </div>
        
        <div className="p-6 text-center">
          <div className={`
            w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4
            ${theme === 'dark' ? 'bg-success/20' : 'bg-success/10'}
          `}>
            <i className="ri-check-line text-4xl text-success"></i>
          </div>
          
          <h3 className="text-2xl font-bold mb-2">{t('mintSuccess.subtitle')}</h3>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-md mx-auto`}>
            {t('mintSuccess.description')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            {/* Left: 3D Preview */}
            <ThreeDViewer 
              modelUrl={threeDOrdinal?.modelUrl} 
              className="aspect-square"
              showControls={true}
            />
            
            {/* Right: Transaction Info */}
            <div className="text-left">
              <h4 className="font-medium mb-4">{t('mintSuccess.transactionDetails')}</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                    {t('mintSuccess.inscriptionNumber')}
                  </p>
                  <p className="font-mono">#{threeDOrdinal?.inscriptionNumber.toLocaleString() || '...'}</p>
                </div>
                <div>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                    {t('mintSuccess.transactionId')}
                  </p>
                  <div className="flex items-center">
                    <p className="font-mono text-xs truncate mr-2">
                      {transaction?.transactionId 
                        ? `${transaction.transactionId.slice(0, 8)}...${transaction.transactionId.slice(-8)}` 
                        : '...'}
                    </p>
                    <button 
                      className="text-primary hover:text-amber-400" 
                      onClick={handleCopyTxId}
                      aria-label="Copy transaction ID"
                    >
                      <i className={copied ? "ri-check-line" : "ri-file-copy-line"}></i>
                    </button>
                  </div>
                </div>
                <div>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                    {t('mintSuccess.collection')}
                  </p>
                  <p>{threeDOrdinal?.collection.name || '...'}</p>
                </div>
                <div>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                    {t('mintSuccess.mintedOn')}
                  </p>
                  <p>{formatDate(transaction?.timestamp) || '...'}</p>
                </div>
                {transaction?.transactionId && (
                  <div className="pt-2">
                    <a 
                      href={`${EXPLORER_URL}${transaction.transactionId}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-amber-400 flex items-center text-sm"
                    >
                      <i className="ri-external-link-line mr-1"></i>
                      {t('mintSuccess.viewOnExplorer')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-4">
            <Button 
              variant="outline" 
              className={`
                px-6 py-3 rounded-md font-medium flex items-center justify-center
                ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}
              `}
              onClick={handleDownload}
              disabled={isLoading3D || !threeDOrdinal?.modelUrl}
            >
              <i className="ri-download-line mr-2"></i>
              {t('mintSuccess.downloadModel')}
            </Button>
            
            <Button 
              className="bg-primary hover:bg-amber-500 text-black px-6 py-3 rounded-md font-medium flex items-center justify-center"
              onClick={() => window.location.href = '/explorer'}
            >
              <i className="ri-gallery-line mr-2"></i>
              {t('mintSuccess.viewInGallery')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintSuccess;
