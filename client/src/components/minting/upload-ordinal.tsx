import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@/context/wallet-context";
import { useMintContext } from "@/context/mint-context";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export function UploadOrdinal() {
  const { t } = useTranslation();
  const { isConnected, walletAddress } = useWallet();
  const { mintStep, setMintStep, setOrdinalData, validateOrdinal } = useMintContext();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file: File) => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: t("upload.error.invalid_type.title"),
        description: t("upload.error.invalid_type.description")
      });
      return;
    }

    // Set file and preview
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleContinue = async () => {
    if (!selectedFile || !isConnected) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would send the file to the server
      // or directly interact with a blockchain API to validate the Ordinal
      const isValid = await validateOrdinal(selectedFile, walletAddress);
      
      if (isValid) {
        setOrdinalData({
          ordinalId: "sample-ordinal-id", // This would come from the API
          imageUrl: imagePreview || "",
          collectionName: "Pixel Foxes"
        });
        setMintStep("preview");
      } else {
        toast({
          variant: "destructive",
          title: t("upload.error.validation.title"),
          description: t("upload.error.validation.description")
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("upload.error.upload.title"),
        description: t("upload.error.upload.description")
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  return (
    <Card className="bg-secondary-light mb-6 border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">{t("upload.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 mb-6">
          {t("upload.description")}
        </p>
        
        {!imagePreview ? (
          <div
            className={cn(
              "border-2 border-dashed border-gray-700 rounded-lg p-6 text-center cursor-pointer",
              isDragging && "border-primary bg-primary/5"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <input
              id="file-upload"
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.svg"
              className="hidden"
              onChange={handleFileChange}
              disabled={!isConnected}
            />
            <UploadCloud className="mx-auto h-12 w-12 text-gray-500" />
            <p className="mt-2 text-sm text-gray-500">
              {isConnected 
                ? t("upload.drag_drop") 
                : t("upload.connect_wallet_first")}
            </p>
            <p className="mt-1 text-xs text-gray-600">
              {t("upload.supported_formats")}
            </p>
          </div>
        ) : (
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Ordinal preview" 
              className="w-full h-48 object-contain bg-secondary rounded-lg" 
            />
            <Button 
              variant="destructive" 
              size="sm" 
              className="absolute top-2 right-2"
              onClick={resetUpload}
            >
              {t("common.remove")}
            </Button>
          </div>
        )}

        <div className="mt-6">
          <Button 
            className="w-full justify-center items-center"
            onClick={handleContinue}
            disabled={!isConnected || !selectedFile || isLoading}
          >
            {isLoading ? t("common.loading") : t("upload.continue")}
            {!isLoading && (
              <svg className="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
