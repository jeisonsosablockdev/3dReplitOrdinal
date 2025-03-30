import { useTranslation } from 'react-i18next';
import { useWallet } from '@/lib/context/WalletContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ConnectWalletButton = () => {
  const { t } = useTranslation();
  const { wallet, disconnectWallet, setWalletModalOpen } = useWallet();
  
  const handleConnect = () => {
    setWalletModalOpen(true);
  };
  
  if (wallet.connected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-primary hover:bg-amber-500 text-black font-medium rounded-md px-4 py-2 flex items-center">
            <i className="ri-wallet-3-line mr-2"></i>
            {wallet.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : t('header.connected')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-surface border-gray-700">
          <DropdownMenuItem 
            className="hover:bg-gray-700 cursor-pointer"
            onClick={disconnectWallet}
          >
            <i className="ri-logout-box-line mr-2"></i>
            {t('header.disconnect')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  return (
    <Button 
      className="bg-primary hover:bg-amber-500 text-black font-medium rounded-md px-4 py-2 flex items-center"
      onClick={handleConnect}
    >
      <i className="ri-wallet-3-line mr-2"></i>
      {t('header.connect')}
    </Button>
  );
};

export default ConnectWalletButton;
