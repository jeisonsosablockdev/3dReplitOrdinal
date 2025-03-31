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
      <Alert variant="destructive" className="border border-red-800 bg-red-950/50">
        <AlertDescription className="flex flex-col space-y-4">
          <p className="text-sm">
            {t("wallet.not_installed.message", "Yours Wallet extension is not installed in your browser.")}
          </p>
          <Button 
            variant="outline" 
            className="mt-2 bg-white/10 border-red-800 hover:bg-white/20"
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
      <DialogContent className="bg-secondary-light border border-gray-800 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            {t("wallet.modal.title")}
          </DialogTitle>
        </DialogHeader>

        {!isWalletInstalled ? (
          <WalletInstallMessage />
        ) : (
          <div className="mt-6 space-y-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:bg-secondary focus:outline-none"
              onClick={handleConnectWallet}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 h-6 w-6 text-primary">
                  <Wallet className="h-6 w-6" />
                </div>
                <div className="ml-3 text-left">
                  <p className="text-sm font-medium text-white">Yours Wallet</p>
                  <p className="text-xs text-gray-500">{t("wallet.modal.connect_yours")}</p>
                </div>
              </div>
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:bg-secondary focus:outline-none opacity-50 cursor-not-allowed"
              disabled
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 h-6 w-6 text-primary">
                  <Package className="h-6 w-6" />
                </div>
                <div className="ml-3 text-left">
                  <p className="text-sm font-medium text-white">{t("wallet.modal.more_wallets")}</p>
                  <p className="text-xs text-gray-500">{t("wallet.modal.coming_soon")}</p>
                </div>
              </div>
              <svg className="h-5 w-5 text-gray-400 opacity-50" viewBox="0 0 20 20" fill="currentColor">
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
            <Button variant="outline" className="flex items-center" onClick={openYoursWalletWebsite}>
              <ExternalLink className="mr-2 h-4 w-4" />
              {t("wallet.visit_website", "Visit Website")}
            </Button>
          )}
          <Button variant="secondary" onClick={onClose} className="ml-2">
            {t("common.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
