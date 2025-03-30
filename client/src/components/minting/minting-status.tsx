import { useMintContext } from "@/context/mint-context";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function MintingStatus() {
  const { t } = useTranslation();
  const { mintingStatus, resetMintProcess, threeDArtifact } = useMintContext();
  const { toast } = useToast();

  const handleCopyTxId = () => {
    if (!threeDArtifact?.txId) return;
    
    navigator.clipboard.writeText(threeDArtifact.txId);
    toast({
      title: t("mint.tx_copied"),
      description: t("mint.tx_copied_description"),
    });
  };

  if (mintingStatus === "idle") return null;

  return (
    <div className="mt-8 space-y-6">
      {mintingStatus === "processing" && (
        <div className="bg-secondary-light rounded-lg p-6 shadow-md">
          <div className="flex items-center">
            <div className="mr-4 flex-shrink-0">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-medium">{t("mint.status.in_progress")}</h3>
              <p className="text-sm text-gray-400">{t("mint.status.in_progress_description")}</p>
              <div className="mt-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-2 bg-primary" style={{ width: "45%" }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {mintingStatus === "success" && (
        <div className="bg-green-900/20 border-l-4 border-green-500 rounded-lg p-6 shadow-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-green-500">{t("mint.status.success")}</h3>
              <div className="mt-2 text-sm">
                <p>{t("mint.status.success_description")}</p>
                {threeDArtifact?.txId && (
                  <div className="mt-2">
                    <span className="text-xs font-semibold text-gray-400">{t("mint.tx_id")}:</span>
                    <span className="font-mono text-xs ml-1 bg-white bg-opacity-20 px-2 py-1 rounded">
                      {threeDArtifact.txId.substring(0, 12)}...{threeDArtifact.txId.substring(threeDArtifact.txId.length - 4)}
                    </span>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="ml-1 text-green-500 hover:text-green-400 p-0"
                      onClick={handleCopyTxId}
                    >
                      {t("mint.tx_copy")}
                    </Button>
                    <a 
                      href={`https://whatsonchain.com/tx/${threeDArtifact.txId}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-1 text-green-500 hover:text-green-400 hover:underline text-xs"
                    >
                      {t("mint.tx_view")}
                    </a>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={resetMintProcess}
                >
                  {t("mint.mint_another")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mintingStatus === "error" && (
        <div className="bg-red-900/20 border-l-4 border-red-500 rounded-lg p-6 shadow-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-500">{t("mint.status.error")}</h3>
              <div className="mt-2 text-sm">
                <p>{t("mint.status.error_description")}</p>
                <p className="mt-1 text-xs text-gray-400">{t("mint.status.error_reason")}</p>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="mt-2"
                  onClick={resetMintProcess}
                >
                  {t("mint.try_again")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
