import { useTranslation } from 'react-i18next';
import { useWallet } from '@/lib/context/WalletContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ConnectWalletModal = () => {
  const { t } = useTranslation();
  const { isWalletModalOpen, setWalletModalOpen, connectWallet } = useWallet();
  
  const handleYoursConnect = async () => {
    const connected = await connectWallet('yours');
    if (connected) {
      setWalletModalOpen(false);
    }
  };
  
  return (
    <Dialog open={isWalletModalOpen} onOpenChange={setWalletModalOpen}>
      <DialogContent className="bg-surface border border-gray-800 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t('wallet.connectWallet')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mb-6">
          <button 
            className="w-full p-4 rounded-lg flex items-center justify-between bg-gray-800 hover:bg-gray-700"
            onClick={handleYoursConnect}
          >
            <div className="flex items-center">
              <img src="https://yours.org/logo.svg" alt="Yours Wallet" className="w-8 h-8 mr-3" />
              <span className="font-medium">{t('wallet.yourWallet')}</span>
            </div>
            <i className="ri-arrow-right-s-line"></i>
          </button>
          
          <button 
            className="w-full p-4 rounded-lg flex items-center justify-between opacity-50 cursor-not-allowed bg-gray-800"
            disabled
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-gray-700">
                <i className="ri-wallet-3-line text-gray-500"></i>
              </div>
              <span className="font-medium">{t('wallet.otherWallets')}</span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-400">
                {t('wallet.soon')}
              </span>
            </div>
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>
        
        <p className="text-sm text-gray-400">
          {t('wallet.termsAndPrivacy')}
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWalletModal;
