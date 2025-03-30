import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ThreeDArtifact } from "@shared/schema";
import { CubeIcon, ExternalLink } from "lucide-react";

export function ExampleOrdinals() {
  const { t } = useTranslation();
  
  // In a real app, this would fetch actual 3D ordinals from the API
  const { data: examples, isLoading } = useQuery<ThreeDArtifact[]>({
    queryKey: ["/api/three-d-artifacts/examples"],
  });

  // Fallback examples if API doesn't return data
  const fallbackExamples = [
    {
      id: 1,
      originalOrdinalId: "1234...5678",
      owner: "Example Owner",
      modelUrl: "",
      status: "completed",
      metadata: { name: "Pixel Fox #247", mintedDaysAgo: 3 }
    },
    {
      id: 2,
      originalOrdinalId: "5678...9012",
      owner: "Example Owner",
      modelUrl: "",
      status: "completed",
      metadata: { name: "Pixel Fox #592", mintedDaysAgo: 7 }
    },
    {
      id: 3,
      originalOrdinalId: "9012...3456",
      owner: "Example Owner",
      modelUrl: "",
      status: "completed",
      metadata: { name: "Pixel Fox #136", mintedDaysAgo: 14 }
    },
    {
      id: 4,
      originalOrdinalId: "3456...7890",
      owner: "Example Owner",
      modelUrl: "",
      status: "completed",
      metadata: { name: "Pixel Fox #429", mintedDaysAgo: 30 }
    }
  ];

  const displayExamples = examples || fallbackExamples;

  const getTimeAgo = (days: number) => {
    if (days === 1) return t("examples.time.day");
    if (days < 7) return t("examples.time.days", { count: days });
    if (days < 30) return t("examples.time.weeks", { count: Math.floor(days / 7) });
    return t("examples.time.months", { count: Math.floor(days / 30) });
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">{t("examples.title")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayExamples.map((example) => (
          <Card key={example.id} className="bg-secondary-light overflow-hidden border-none shadow-md">
            <div className="h-48 bg-secondary relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <CubeIcon className="h-12 w-12 text-gray-700" />
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {example.metadata?.name || `3D Ordinal #${example.id}`}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {t("examples.minted")} {getTimeAgo(example.metadata?.mintedDaysAgo || 0)} {t("examples.ago")}
                  </p>
                </div>
                <span className="bg-primary bg-opacity-20 text-primary text-xs px-2 py-1 rounded-full">3D</span>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {t("examples.ordinal_id")}: <span className="font-mono">{example.originalOrdinalId}</span>
                </div>
                <button className="text-primary hover:text-primary-600 text-sm flex items-center">
                  <span>{t("examples.view")}</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
