import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/wallet-context";
import { useTranslation } from "react-i18next";
import { Wallet, Package } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connect } = useWallet();
  const { t } = useTranslation();

  const handleConnectWallet = async () => {
    await connect();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-secondary-light border border-gray-800 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            {t("wallet.modal.title")}
          </DialogTitle>
        </DialogHeader>
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
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
