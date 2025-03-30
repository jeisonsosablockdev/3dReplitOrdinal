import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WalletState } from '../types';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface WalletContextType {
  wallet: WalletState;
  connectWallet: (provider: 'yours') => Promise<boolean>;
  disconnectWallet: () => void;
  signTransaction: (transactionData: any) => Promise<string | null>;
  isWalletModalOpen: boolean;
  setWalletModalOpen: (isOpen: boolean) => void;
}

const initialWalletState: WalletState = {
  connected: false,
  address: null,
  balance: null,
  provider: null,
};

// Create a default context value
const defaultContextValue: WalletContextType = {
  wallet: initialWalletState,
  connectWallet: async () => false,
  disconnectWallet: () => console.log('WalletProvider not initialized'),
  signTransaction: async () => null,
  isWalletModalOpen: false,
  setWalletModalOpen: () => console.log('WalletProvider not initialized')
};

const WalletContext = createContext<WalletContextType>(defaultContextValue);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>(initialWalletState);
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Check if wallet was previously connected
  useEffect(() => {
    const checkConnectedWallet = async () => {
      // Check for Yours wallet connection
      if (typeof window !== 'undefined' && window.yours) {
        try {
          const isConnected = await window.yours.isConnected();
          if (isConnected) {
            const address = await window.yours.getAddress();
            const balance = await window.yours.getBalance();
            
            setWallet({
              connected: true,
              address,
              balance,
              provider: 'yours',
            });
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error);
        }
      }
    };
    
    checkConnectedWallet();
  }, []);

  const connectWallet = async (provider: 'yours'): Promise<boolean> => {
    if (provider === 'yours') {
      try {
        // Check if Yours wallet is available
        if (typeof window !== 'undefined' && window.yours) {
          await window.yours.requestAccount();
          const address = await window.yours.getAddress();
          const balance = await window.yours.getBalance();
          
          setWallet({
            connected: true,
            address,
            balance,
            provider: 'yours',
          });
          
          toast({
            title: t('wallet.connectSuccess'),
            description: t('wallet.connectedAddress', { address: address.slice(0, 6) + '...' + address.slice(-4) }),
          });
          
          return true;
        } else {
          toast({
            title: t('wallet.notFound'),
            description: t('wallet.installPrompt'),
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        toast({
          title: t('wallet.connectError'),
          description: t('wallet.tryAgain'),
          variant: 'destructive',
        });
      }
    }
    
    return false;
  };

  const disconnectWallet = () => {
    // Disconnect wallet
    if (wallet.provider === 'yours' && typeof window !== 'undefined' && window.yours) {
      try {
        window.yours.disconnect();
      } catch (error) {
        console.error('Failed to disconnect wallet:', error);
      }
    }
    
    setWallet(initialWalletState);
    toast({
      title: t('wallet.disconnected'),
      description: t('wallet.disconnectedDesc'),
    });
  };

  const signTransaction = async (transactionData: any): Promise<string | null> => {
    if (!wallet.connected) {
      toast({
        title: t('wallet.notConnected'),
        description: t('wallet.connectFirst'),
        variant: 'destructive',
      });
      return null;
    }
    
    try {
      if (wallet.provider === 'yours' && typeof window !== 'undefined' && window.yours) {
        const signedTx = await window.yours.signTransaction(transactionData);
        return signedTx;
      }
    } catch (error) {
      console.error('Failed to sign transaction:', error);
      toast({
        title: t('wallet.signError'),
        description: t('wallet.rejected'),
        variant: 'destructive',
      });
    }
    
    return null;
  };

  return (
    <WalletContext.Provider 
      value={{ 
        wallet, 
        connectWallet, 
        disconnectWallet, 
        signTransaction,
        isWalletModalOpen,
        setWalletModalOpen
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  return useContext(WalletContext);
};

// Add global type for Yours wallet
declare global {
  interface Window {
    yours?: {
      isConnected: () => Promise<boolean>;
      requestAccount: () => Promise<void>;
      getAddress: () => Promise<string>;
      getBalance: () => Promise<number>;
      disconnect: () => Promise<void>;
      signTransaction: (transactionData: any) => Promise<string>;
    };
  }
}
