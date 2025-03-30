import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface WalletContextType {
  isConnected: boolean;
  isConnecting: boolean;
  walletAddress: string;
  connect: () => Promise<boolean>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  isConnecting: false,
  walletAddress: "",
  connect: async () => false,
  disconnect: () => {},
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation();

  // Check if wallet was previously connected
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setWalletAddress(savedAddress);
      setIsConnected(true);
    }
  }, []);

  const connect = async (): Promise<boolean> => {
    try {
      setIsConnecting(true);
      
      // Simulating wallet connection with BSV wallet
      // In a real application, this would integrate with a wallet like "Yours Wallet"
      
      // Simulate a wallet connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful connection
      const mockAddress = "1ABCxyz123456789DEFGHI987654321JKL";
      setWalletAddress(mockAddress);
      setIsConnected(true);
      
      // Save to local storage
      localStorage.setItem("walletAddress", mockAddress);
      
      toast({
        title: t("wallet.connected"),
        description: t("wallet.connected_description"),
      });
      
      return true;
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        variant: "destructive",
        title: t("wallet.error.title"),
        description: t("wallet.error.description"),
      });
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setWalletAddress("");
    setIsConnected(false);
    localStorage.removeItem("walletAddress");
    
    toast({
      title: t("wallet.disconnected"),
      description: t("wallet.disconnected_description"),
    });
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isConnecting,
        walletAddress,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
