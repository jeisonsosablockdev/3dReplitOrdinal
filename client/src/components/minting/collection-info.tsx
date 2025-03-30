import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useMintContext } from "@/context/mint-context";
import { useWallet } from "@/context/wallet-context";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Collection } from "@shared/schema";

export function CollectionInfo() {
  const { t } = useTranslation();
  const { isConnected } = useWallet();
  const { ordinalData } = useMintContext();

  // Fetch collection data based on collection name from ordinalData
  const { data: collection, isLoading } = useQuery<Collection>({
    queryKey: ["/api/collections", ordinalData?.collectionName],
    enabled: !!ordinalData?.collectionName && isConnected,
  });

  return (
    <Card className="bg-secondary-light border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">{t("collection.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-6">
          <div className="relative h-16 w-16 rounded-lg overflow-hidden mr-4 bg-secondary">
            {ordinalData?.imageUrl ? (
              <img 
                src={ordinalData.imageUrl} 
                alt={ordinalData.collectionName} 
                className="h-full w-full object-cover"
              />
            ) : (
              <svg className="h-full w-full text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm-9 9h7v7H4v-7zm9 0h7v7h-7v-7z" />
              </svg>
            )}
          </div>
          <div>
            <h4 className="font-medium">
              {ordinalData?.collectionName || t("collection.connect_wallet")}
            </h4>
            <p className="text-sm text-gray-400">
              {ordinalData ? t("collection.view_stats") : t("collection.view_eligible")}
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm text-gray-400 mb-2">{t("collection.stats")}</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary p-3 rounded-md">
              <p className="text-xs text-gray-500">{t("collection.max_supply")}</p>
              <p className="font-semibold">{isLoading ? "--" : collection?.maxSupply || "--"}</p>
            </div>
            <div className="bg-secondary p-3 rounded-md">
              <p className="text-xs text-gray-500">{t("collection.minted")}</p>
              <p className="font-semibold">{isLoading ? "--" : collection?.minted || "--"}</p>
            </div>
            <div className="bg-secondary p-3 rounded-md">
              <p className="text-xs text-gray-500">{t("collection.3d_minted")}</p>
              <p className="font-semibold">{isLoading ? "--" : collection?.threeDMinted || "--"}</p>
            </div>
            <div className="bg-secondary p-3 rounded-md">
              <p className="text-xs text-gray-500">{t("collection.mint_fee")}</p>
              <p className="font-semibold">
                {isLoading 
                  ? "--" 
                  : collection?.mintFee 
                    ? `${collection.mintFee} sats` 
                    : "--"
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
