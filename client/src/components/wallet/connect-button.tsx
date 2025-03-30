import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletModal } from "./wallet-modal";
import { useWallet } from "@/context/wallet-context";
import { useTranslation } from "react-i18next";
import { Wallet, Power } from "lucide-react";

export function ConnectButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected, walletAddress, disconnect } = useWallet();
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
          <div className="hidden md:block text-sm text-gray-400 mr-2">
            {formatAddress(walletAddress)}
          </div>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={disconnect}
            className="bg-red-700 hover:bg-red-800"
          >
            <Power className="h-4 w-4 mr-2" />
            {t("wallet.disconnect")}
          </Button>
        </div>
      ) : (
        <Button
          onClick={openModal}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-black bg-primary hover:bg-primary-600 focus:outline-none"
        >
          <span>{t("wallet.connect")}</span>
          <Wallet className="ml-2 h-4 w-4" />
        </Button>
      )}
      
      <WalletModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
