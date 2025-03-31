import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

// Define the Yours Provider interface based on their API
interface YoursProvider {
  isConnected: () => Promise<boolean>;
  getAddress: () => Promise<string>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

// Extend the Window interface to include the Yours provider
declare global {
  interface Window {
    yours?: YoursProvider;
  }
}

interface WalletContextType {
  isConnected: boolean;
  isConnecting: boolean;
  walletAddress: string;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  isWalletInstalled: boolean;
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  isConnecting: false,
  walletAddress: "",
  connect: async () => false,
  disconnect: async () => {},
  isWalletInstalled: false,
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Check if wallet extension is installed
  useEffect(() => {
    const checkWalletInstalled = () => {
      setIsWalletInstalled(!!window.yours);
    };

    checkWalletInstalled();

    // Re-check when the window gains focus
    window.addEventListener('focus', checkWalletInstalled);
    
    return () => {
      window.removeEventListener('focus', checkWalletInstalled);
    };
  }, []);

  // Check if wallet was previously connected and verify with extension
  useEffect(() => {
    const checkConnection = async () => {
      // Only proceed if wallet extension is installed
      if (!window.yours) return;

      try {
        // Check if the wallet is connected
        const isWalletConnected = await window.yours.isConnected();
        
        if (isWalletConnected) {
          const address = await window.yours.getAddress();
          setWalletAddress(address);
          setIsConnected(true);
          localStorage.setItem("walletAddress", address);
        } else {
          // Clear any stale data
          localStorage.removeItem("walletAddress");
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
        localStorage.removeItem("walletAddress");
      }
    };

    checkConnection();
  }, [isWalletInstalled]);

  const connect = async (): Promise<boolean> => {
    try {
      setIsConnecting(true);
      
      // Check if Yours Wallet extension is installed
      if (!window.yours) {
        toast({
          variant: "destructive",
          title: t("wallet.not_installed.title"),
          description: t("wallet.not_installed.description"),
        });
        return false;
      }
      
      // Connect to Yours Wallet
      await window.yours.connect();
      
      // Get wallet address
      const address = await window.yours.getAddress();
      
      setWalletAddress(address);
      setIsConnected(true);
      
      // Save to local storage
      localStorage.setItem("walletAddress", address);
      
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

  const disconnect = async () => {
    try {
      if (window.yours) {
        await window.yours.disconnect();
      }
      
      setWalletAddress("");
      setIsConnected(false);
      localStorage.removeItem("walletAddress");
      
      toast({
        title: t("wallet.disconnected"),
        description: t("wallet.disconnected_description"),
      });
    } catch (error) {
      console.error("Disconnect error:", error);
      toast({
        variant: "destructive",
        title: t("wallet.error.disconnect_title"),
        description: t("wallet.error.disconnect_description"),
      });
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isConnecting,
        walletAddress,
        connect,
        disconnect,
        isWalletInstalled,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
