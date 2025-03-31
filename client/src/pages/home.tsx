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
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
              {t("home.title")}
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-indigo-200 mb-8">
              {t("home.subtitle")}
            </p>
            <div className="inline-block animate-pulse bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-600 rounded-md p-[2px]">
              <div className="bg-black bg-opacity-50 rounded-md">
                <ProgressSteps />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="bg-[#121212] border border-indigo-900/50 rounded-xl shadow-lg overflow-hidden">
              <UploadOrdinal />
            </div>
            <div className="bg-[#121212] border border-indigo-900/50 rounded-xl shadow-lg overflow-hidden">
              <CollectionInfo />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-[#121212] border border-indigo-900/50 rounded-xl shadow-lg overflow-hidden">
              <ThreeViewer />
            </div>
            <div className="bg-[#121212] border border-indigo-900/50 rounded-xl shadow-lg overflow-hidden">
              <MintInfo />
            </div>
          </div>
        </div>

        {/* Show minting status if active */}
        {mintingStatus !== "idle" && (
          <div className="mt-8">
            <MintingStatus />
          </div>
        )}

        {/* Example Ordinals Section */}
        <div className="mt-16">
          <ExampleOrdinals />
        </div>
      </div>
    </div>
  );
}
