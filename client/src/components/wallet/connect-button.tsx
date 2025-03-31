import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletModal } from "./wallet-modal";
import { useWallet } from "@/context/wallet-context";
import { useTranslation } from "react-i18next";
import { Wallet, Power } from "lucide-react";

export function ConnectButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected, walletAddress, disconnect, isWalletInstalled } = useWallet();
  const { t } = useTranslation();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <>
      {isConnected ? (
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center text-sm bg-gray-800 border border-gray-700 rounded-md px-2 py-1 mr-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-200">{formatAddress(walletAddress)}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={disconnect}
            className="border border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white transition-colors duration-200"
          >
            <Power className="h-4 w-4 mr-2" />
            {t("wallet.disconnect")}
          </Button>
        </div>
      ) : (
        <Button
          onClick={openModal}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-orange-500 transition-colors duration-200 focus:outline-none border border-primary"
        >
          <Wallet className="mr-2 h-4 w-4" />
          <span>{t("wallet.connect")}</span>
        </Button>
      )}
      
      <WalletModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
