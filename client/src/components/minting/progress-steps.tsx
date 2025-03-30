import { useMintContext } from "@/context/mint-context";
import { useWallet } from "@/context/wallet-context";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const steps = ["connect", "upload", "preview", "mint"] as const;

export function ProgressSteps() {
  const { t } = useTranslation();
  const { mintStep } = useMintContext();
  const { isConnected } = useWallet();
  
  const getStepNumber = (step: typeof steps[number]) => {
    return steps.indexOf(step) + 1;
  };

  const isActive = (step: typeof steps[number]) => {
    return getStepNumber(step) <= getStepNumber(mintStep);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("progress.title")}</h2>
        <div className="text-sm text-gray-400">
          {t("progress.network")}: <span className="text-primary font-medium">BSV {t("progress.mainnet")}</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step) => (
          <div className="flex-1 flex" key={step}>
            <div className={cn(
              "progress-step flex flex-col items-center",
              isActive(step) && "active"
            )}>
              <div className={cn(
                "rounded-full h-8 w-8 flex items-center justify-center font-semibold",
                isActive(step) ? "bg-primary text-black" : "bg-secondary-light text-gray-400"
              )}>
                {getStepNumber(step)}
              </div>
              <div className={cn(
                "text-sm mt-2",
                isActive(step) ? "font-medium" : "text-gray-400"
              )}>
                {t(`progress.steps.${step}`)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
