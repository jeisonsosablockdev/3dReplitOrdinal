import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useWallet } from "@/context/wallet-context";
import { useMintContext } from "@/context/mint-context";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { MintResponse } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function MintInfo() {
  const { t } = useTranslation();
  const { isConnected, walletAddress } = useWallet();
  const { ordinalData, mintStep, setMintStep, setMintingStatus, generateAnd3DMint } = useMintContext();
  const { toast } = useToast();

  // Define the fees (in a real app, this might come from an API)
  const generationFee = 0.0001;
  const networkFee = 0.00005;
  const totalFee = generationFee + networkFee;

  // Mutation for minting
  const { mutate: mintOrdinal, isPending } = useMutation({
    mutationFn: async () => {
      if (!ordinalData?.ordinalId) throw new Error("No ordinal data");
      
      const response = await generateAnd3DMint(ordinalData.ordinalId, walletAddress);
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        setMintingStatus("success");
        toast({
          title: t("mint.success.title"),
          description: t("mint.success.description"),
        });
      } else {
        setMintingStatus("error");
        toast({
          variant: "destructive",
          title: t("mint.error.title"),
          description: data.message || t("mint.error.description"),
        });
      }
    },
    onError: (error) => {
      console.error("Minting error:", error);
      setMintingStatus("error");
      toast({
        variant: "destructive",
        title: t("mint.error.title"),
        description: t("mint.error.description"),
      });
    }
  });

  const handleMint = () => {
    if (!isConnected || !ordinalData) return;
    
    setMintingStatus("processing");
    setMintStep("mint");
    mintOrdinal();
  };

  const isButtonDisabled = 
    !isConnected || 
    mintStep !== "preview" || 
    !ordinalData || 
    isPending;

  return (
    <Card className="bg-secondary-light border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">{t("mint.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">{t("mint.generation_fee")}</span>
            <span className="font-medium">{generationFee} BSV</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">{t("mint.network_fee")}</span>
            <span className="font-medium">{networkFee} BSV</span>
          </div>
          <div className="border-t border-gray-700 my-2"></div>
          <div className="flex justify-between">
            <span className="font-medium">{t("mint.total")}</span>
            <span className="font-bold text-primary">{totalFee} BSV</span>
          </div>
        </div>
        
        <Button
          className="w-full justify-center items-center py-3"
          disabled={isButtonDisabled}
          onClick={handleMint}
        >
          {isPending ? t("mint.processing") : t("mint.button")}
        </Button>
        
        <p className="mt-2 text-xs text-center text-gray-500">
          {t("mint.terms_agreement")} 
          <a href="#" className="text-primary hover:text-primary-600">
            {t("mint.terms_link")}
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
