import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useMintContext } from "@/context/mint-context";
import { setup3DScene, cleanup3DScene } from "@/lib/three-utils";
import { RotateCw, Pause, Send, Maximize } from "lucide-react";

export function ThreeViewer() {
  const { t } = useTranslation();
  const { mintStep, ordinalData, threeDArtifact } = useMintContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Initialize and cleanup Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // We only load the 3D viewer when we're in the preview or mint step
    // and we have a 3D artifact or an ordinal to convert
    const shouldRender = 
      (mintStep === "preview" || mintStep === "mint") && 
      (!!threeDArtifact || !!ordinalData);
    
    if (!shouldRender) return;
    
    const { toggleRotation, dispose } = setup3DScene(
      containerRef.current,
      threeDArtifact?.modelUrl || ordinalData?.imageUrl,
      isRotating
    );
    
    return () => {
      dispose();
      cleanup3DScene();
    };
  }, [mintStep, ordinalData, threeDArtifact, isRotating]);
  
  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };
  
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  const hasModel = !!threeDArtifact?.modelUrl || (mintStep === "preview" && !!ordinalData);

  return (
    <Card className="bg-secondary-light mb-6 border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">{t("viewer.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={containerRef} 
          className="scene-container relative"
        >
          {!hasModel && (
            <div className="scene-placeholder flex flex-col items-center justify-center">
              <svg className="h-16 w-16 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.75 2a.75.75 0 00-1.5 0v.75H9.75a.75.75 0 000 1.5h1.5v1.5a.75.75 0 001.5 0v-1.5h1.5a.75.75 0 000-1.5h-1.5V2z" />
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM6.222 6.222a8.5 8.5 0 0110.582.045.75.75 0 01-.991 1.129 7 7 0 00-8.712-.045.75.75 0 01-.88-1.13z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">{t("viewer.connect_and_upload")}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-center mt-4 space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="px-3 py-1 rounded bg-secondary text-gray-400 text-sm"
            disabled={!hasModel}
            onClick={toggleRotation}
          >
            {isRotating ? <Pause className="h-4 w-4" /> : <RotateCw className="h-4 w-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="px-3 py-1 rounded bg-secondary text-gray-400 text-sm"
            disabled={!hasModel}
            onClick={toggleFullscreen}
          >
            <Maximize className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="px-3 py-1 rounded bg-secondary text-gray-400 text-sm"
            disabled={!hasModel || !threeDArtifact?.modelUrl}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
