import { ProgressSteps } from "@/components/minting/progress-steps";
import { UploadOrdinal } from "@/components/minting/upload-ordinal";
import { CollectionInfo } from "@/components/minting/collection-info";
import { ThreeViewer } from "@/components/minting/three-viewer";
import { MintInfo } from "@/components/minting/mint-info";
import { MintingStatus } from "@/components/minting/minting-status";
import { ExampleOrdinals } from "@/components/example-ordinals";
import { useWallet } from "@/context/wallet-context";
import { useMintContext } from "@/context/mint-context";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  const { isConnected } = useWallet();
  const { mintingStatus } = useMintContext();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">{t("home.title")}</h1>
        <p className="mt-2 text-gray-400">
          {t("home.subtitle")}
        </p>
      </div>

      <ProgressSteps />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          <UploadOrdinal />
          <CollectionInfo />
        </div>

        {/* Right Column */}
        <div>
          <ThreeViewer />
          <MintInfo />
        </div>
      </div>

      {/* Show minting status if active */}
      {mintingStatus !== "idle" && <MintingStatus />}

      {/* Example Ordinals Section */}
      <ExampleOrdinals />
    </div>
  );
}
