import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/wallet-context";
import { useTranslation } from "react-i18next";
import { Wallet, Package, ExternalLink, Download, AlertTriangle, ChevronRight } from "lucide-react";
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
      <div className="relative overflow-hidden rounded-lg border border-red-800 bg-red-950/20 p-6">
        <div className="absolute -top-6 -right-6 h-12 w-12 bg-red-500 opacity-20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 h-24 w-24 bg-red-600 opacity-20 rounded-full blur-xl"></div>
        <div className="flex flex-col space-y-4 relative z-10">
          <div className="flex items-center text-red-400 mb-2">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <h3 className="font-semibold">{t("wallet.not_installed.title", "Wallet Required")}</h3>
          </div>
          <p className="text-sm text-red-200">
            {t("wallet.not_installed.message", "Yours Wallet extension is not installed in your browser.")}
          </p>
          <Button 
            className="mt-2 w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 shadow-lg shadow-red-900/20"
            onClick={openYoursWalletWebsite}
          >
            <Download className="mr-2 h-4 w-4" />
            {t("wallet.not_installed.install", "Install Yours Wallet")}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#121212] border border-indigo-900/50 rounded-xl shadow-xl text-white sm:max-w-lg overflow-hidden">
        <div className="absolute -top-24 -right-24 h-48 w-48 bg-indigo-600 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-48 w-48 bg-purple-600 opacity-10 rounded-full blur-3xl"></div>
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
            {t("wallet.modal.title")}
          </DialogTitle>
        </DialogHeader>

        {!isWalletInstalled ? (
          <WalletInstallMessage />
        ) : (
          <div className="mt-6 space-y-4 relative z-10">
            <div className="p-0.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-xl">
              <Button
                variant="outline"
                className="w-full flex items-center justify-between p-4 bg-[#121212] rounded-xl hover:bg-black/50 border-0 focus:outline-none"
                onClick={handleConnectWallet}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-900/50 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-indigo-300" />
                  </div>
                  <div className="ml-4 text-left">
                    <p className="text-sm font-medium text-white">Yours Wallet</p>
                    <p className="text-xs text-indigo-300/70">{t("wallet.modal.connect_yours")}</p>
                  </div>
                </div>
                <div className="bg-indigo-900/30 rounded-full h-6 w-6 flex items-center justify-center">
                  <ChevronRight className="h-4 w-4 text-indigo-300" />
                </div>
              </Button>
            </div>

            <div className="p-0.5 rounded-xl bg-gradient-to-r from-gray-700 to-gray-600 opacity-60">
              <Button
                variant="outline"
                className="w-full flex items-center justify-between p-4 bg-[#121212] rounded-xl border-0 cursor-not-allowed"
                disabled
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-4 text-left">
                    <p className="text-sm font-medium text-gray-400">{t("wallet.modal.more_wallets")}</p>
                    <p className="text-xs text-gray-500">{t("wallet.modal.coming_soon")}</p>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-full h-6 w-6 flex items-center justify-center">
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </div>
              </Button>
            </div>
          </div>
        )}
        
        <DialogFooter className="mt-8 flex justify-end relative z-10">
          {!isWalletInstalled && (
            <Button 
              variant="outline" 
              className="flex items-center border-indigo-800/50 text-indigo-300 hover:bg-indigo-900/30 hover:text-indigo-200" 
              onClick={openYoursWalletWebsite}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {t("wallet.visit_website", "Visit Website")}
            </Button>
          )}
          <Button 
            variant="secondary" 
            onClick={onClose} 
            className="ml-2 bg-black/40 hover:bg-black/60 text-indigo-300 hover:text-indigo-200"
          >
            {t("common.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
