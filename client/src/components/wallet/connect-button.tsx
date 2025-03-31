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
          <div className="hidden md:flex items-center px-3 py-1.5 rounded-md bg-indigo-900/30 border border-indigo-800/50 text-sm text-indigo-200 font-medium">
            <div className="h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
            {formatAddress(walletAddress)}
          </div>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={disconnect}
            className="bg-gradient-to-r from-rose-700 to-red-700 hover:from-rose-800 hover:to-red-800 text-white shadow-lg shadow-red-900/20 border-0"
          >
            <Power className="h-4 w-4 mr-2" />
            {t("wallet.disconnect")}
          </Button>
        </div>
      ) : (
        <Button
          onClick={openModal}
          size="sm"
          className="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-900/30 border-0"
        >
          <span className="relative z-10 flex items-center font-medium">
            {t("wallet.connect")}
            <Wallet className="ml-2 h-4 w-4" />
          </span>
          <span className="absolute inset-0 bg-white/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></span>
        </Button>
      )}
      
      <WalletModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
