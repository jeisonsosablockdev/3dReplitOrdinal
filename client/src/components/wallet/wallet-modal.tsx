import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/wallet-context";
import { useTranslation } from "react-i18next";
import { Wallet, Package, ExternalLink, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connect, isWalletInstalled } = useWallet();
  const { t } = useTranslation();

  const handleConnectWallet = async () => {
    await connect();
    onClose();
  };

  const openYoursWalletWebsite = () => {
    window.open("https://app.yours.org/", "_blank");
  };

  const WalletInstallMessage = () => (
    <div className="my-6">
      <Alert className="border border-primary/30 bg-primary/10 text-white">
        <AlertDescription className="flex flex-col space-y-4">
          <p className="text-sm">
            {t("wallet.not_installed.message", "Yours Wallet extension is not installed in your browser.")}
          </p>
          <Button 
            variant="default" 
            className="mt-2 bg-primary hover:bg-orange-500 text-white border-none transition-colors duration-200"
            onClick={openYoursWalletWebsite}
          >
            <Download className="mr-2 h-4 w-4" />
            {t("wallet.not_installed.install", "Install Yours Wallet")}
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-900 border border-gray-800 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-primary">
            {t("wallet.modal.title")}
          </DialogTitle>
        </DialogHeader>

        {!isWalletInstalled ? (
          <WalletInstallMessage />
        ) : (
          <div className="mt-6 space-y-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-between p-4 border border-gray-700 bg-gray-800 hover:bg-gray-700 text-white rounded-lg focus:outline-none transition-colors duration-200"
              onClick={handleConnectWallet}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-3 text-left">
                  <p className="text-base font-medium text-white">Yours Wallet</p>
                  <p className="text-xs text-gray-400">{t("wallet.modal.connect_yours")}</p>
                </div>
              </div>
              <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center justify-between p-4 border border-gray-700 bg-gray-800/50 rounded-lg focus:outline-none opacity-50 cursor-not-allowed"
              disabled
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-700/50 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-gray-500" />
                </div>
                <div className="ml-3 text-left">
                  <p className="text-base font-medium text-gray-400">{t("wallet.modal.more_wallets")}</p>
                  <p className="text-xs text-gray-500">{t("wallet.modal.coming_soon")}</p>
                </div>
              </div>
              <svg className="h-5 w-5 text-gray-500 opacity-50" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        )}
        
        <DialogFooter className="mt-6 flex justify-end">
          {!isWalletInstalled && (
            <Button variant="outline" className="bg-transparent border border-primary text-primary hover:bg-primary/10 transition-colors duration-200 flex items-center" onClick={openYoursWalletWebsite}>
              <ExternalLink className="mr-2 h-4 w-4" />
              {t("wallet.visit_website", "Visit Website")}
            </Button>
          )}
          <Button variant="secondary" onClick={onClose} className="ml-2 bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200">
            {t("common.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
