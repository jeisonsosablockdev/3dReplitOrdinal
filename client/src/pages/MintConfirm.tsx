import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MintingSteps from '@/components/shared/MintingSteps';
import ThreeDViewer from '@/components/shared/ThreeDViewer';
import { useOrdinalById } from '@/lib/hooks/useOrdinalValidation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, BASE_MINT_FEE, NETWORK_FEE_ESTIMATE, MODEL_QUALITIES } from '@/lib/constants';
import { ThreeDOrdinal } from '@/lib/types';
import { useTheme } from '@/lib/context/ThemeContext';
import { useWallet } from '@/lib/context/WalletContext';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const MintConfirm = () => {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { theme } = useTheme();
  const { wallet, signTransaction } = useWallet();
  const { toast } = useToast();
  
  const [modelQuality, setModelQuality] = useState('standard');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  
  // Get selected quality fee
  const selectedQuality = MODEL_QUALITIES.find(q => q.id === modelQuality);
  const additionalFee = selectedQuality?.additionalFee || 0;
  const totalFee = BASE_MINT_FEE + NETWORK_FEE_ESTIMATE + additionalFee;
  
  // Fetch original ordinal
  const { data: ordinal } = useOrdinalById(params.id);
  
  // Fetch generated 3D model
  const { data: threeDOrdinal } = useQuery({
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
  
  // Mint mutation
  const mintMutation = useMutation({
    mutationFn: async (data: { 
      ordinalId: string; 
      quality: string; 
      wallet: string;
    }) => {
      const response = await apiRequest('POST', API_ENDPOINTS.MINT_3D, data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.data?.transactionId) {
        setLocation(`/mint-success/${data.data.threeDOrdinalId}`);
      } else {
        toast({
          title: t('common.error'),
          description: data.error || t('mintConfirm.mintError'),
          variant: 'destructive',
        });
        setIsMinting(false);
      }
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: (error as Error).message,
        variant: 'destructive',
      });
      setIsMinting(false);
    }
  });
  
  const handleBack = () => {
    setLocation(`/preview/${params.id}`);
  };
  
  const handleMint = async () => {
    if (!wallet.connected) {
      toast({
        title: t('wallet.notConnected'),
        description: t('wallet.connectFirst'),
        variant: 'destructive',
      });
      return;
    }
    
    if (!termsAccepted) {
      toast({
        title: t('common.error'),
        description: t('mintConfirm.acceptTerms'),
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsMinting(true);
      
      // Create transaction data
      const transactionData = {
        type: 'bsv-20',
        op: '3d-mint',
        ordinalId: params.id,
        quality: modelQuality,
        fee: totalFee,
      };
      
      // Sign transaction
      const signedTx = await signTransaction(transactionData);
      
      if (!signedTx) {
        setIsMinting(false);
        return;
      }
      
      // Submit signed transaction to mint
      await mintMutation.mutateAsync({
        ordinalId: params.id,
        quality: modelQuality,
        wallet: wallet.address || '',
      });
      
    } catch (error) {
      console.error('Minting error:', error);
      toast({
        title: t('common.error'),
        description: (error as Error).message,
        variant: 'destructive',
      });
      setIsMinting(false);
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
      <MintingSteps currentStep={3} />

      {/* Mint Confirm Card */}
      <div className={`
        rounded-xl overflow-hidden border shadow-lg
        ${theme === 'dark' ? 'bg-surface border-gray-800' : 'bg-white border-gray-200'}
      `}>
        <div className={`
          border-b px-6 py-4
          ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}
        `}>
          <h2 className="text-xl font-bold">{t('mintConfirm.title')}</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Transaction Details */}
            <div>
              <h3 className="font-medium mb-4">{t('mintConfirm.transactionDetails')}</h3>
              <div className={`
                p-4 space-y-4 mb-6 rounded-lg
                ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}
              `}>
                <div className="flex justify-between items-center">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    {t('mintConfirm.mintFee')}
                  </span>
                  <span className="font-medium">
                    {BASE_MINT_FEE.toLocaleString()} sats
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    {t('mintConfirm.networkFee')}
                  </span>
                  <span className="font-medium">
                    {NETWORK_FEE_ESTIMATE.toLocaleString()} sats
                  </span>
                </div>
                {additionalFee > 0 && (
                  <div className="flex justify-between items-center">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                      {t('mintConfirm.qualityFee')}
                    </span>
                    <span className="font-medium">
                      {additionalFee.toLocaleString()} sats
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    {t('mintConfirm.total')}
                  </span>
                  <span className="font-medium text-lg">
                    {totalFee.toLocaleString()} sats
                  </span>
                </div>
              </div>
              
              <h3 className="font-medium mb-4">{t('mintConfirm.mintSettings')}</h3>
              <div className={`
                p-4 space-y-4 rounded-lg
                ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}
              `}>
                <div>
                  <label className={`block text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                    {t('mintConfirm.modelQuality')}
                  </label>
                  <Select 
                    value={modelQuality}
                    onValueChange={setModelQuality}
                  >
                    <SelectTrigger className={`w-full ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
                      {MODEL_QUALITIES.map(quality => (
                        <SelectItem key={quality.id} value={quality.id}>
                          {quality.name} {quality.additionalFee > 0 ? `(+${quality.additionalFee} sats)` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className={`block text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                    {t('mintConfirm.inscriptionData')}
                  </label>
                  <div className={`
                    w-full font-mono text-xs px-3 py-3 rounded-md
                    ${theme === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-300'}
                  `}>
                    {`{
  "p": "bsv-20",
  "op": "3d-mint",
  "collection": "${ordinal?.collection.id || '-'}",
  "source": "${ordinal?.inscriptionNumber || '-'}"
}`}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right: Preview */}
            <div>
              <h3 className="font-medium mb-4">{t('preview.threeDPreview')}</h3>
              <ThreeDViewer 
                modelUrl={threeDOrdinal?.modelUrl} 
                className="mb-4"
                showControls={true}
              />
              
              <div className={`
                p-4 rounded-lg
                ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}
              `}>
                <h4 className="font-medium mb-3">{t('mintConfirm.confirmation')}</h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                  {t('mintConfirm.confirmationText')}
                </p>
                
                <div className="flex items-center mb-4">
                  <Checkbox 
                    id="terms" 
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    className="mr-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label 
                    htmlFor="terms" 
                    className="text-sm cursor-pointer"
                  >
                    {t('mintConfirm.irreversible')}
                  </label>
                </div>
                
                <Button 
                  className="w-full bg-primary hover:bg-amber-500 text-black font-medium py-3 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleMint}
                  disabled={isMinting || !termsAccepted || !wallet.connected}
                >
                  {isMinting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      {t('validation.processing')}
                    </>
                  ) : (
                    <>
                      <i className="ri-quill-pen-line mr-2"></i>
                      {t('mintConfirm.mintButton')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Button Row */}
        <div className={`
          border-t p-6 flex items-center
          ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}
        `}>
          <Button 
            variant="ghost" 
            className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} px-4 py-2 rounded-md flex items-center`}
            onClick={handleBack}
            disabled={isMinting}
          >
            <i className="ri-arrow-left-line mr-2"></i>
            {t('common.back')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MintConfirm;
