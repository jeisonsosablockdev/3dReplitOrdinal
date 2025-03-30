import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { use3DRenderer } from '@/lib/hooks/use3DRenderer';
import { useTheme } from '@/lib/context/ThemeContext';

interface ThreeDViewerProps {
  modelUrl?: string;
  className?: string;
  showControls?: boolean;
}

const ThreeDViewer = ({ modelUrl, className = '', showControls = true }: ThreeDViewerProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const containerId = useRef(`viewer-${Math.random().toString(36).substr(2, 9)}`);
  
  const { isLoading, error, zoomIn, zoomOut, resetView, loaded } = use3DRenderer({
    modelUrl,
    containerId: containerId.current,
  });
  
  return (
    <div className={`relative ${className}`}>
      <div 
        id={containerId.current}
        className={`
          ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-200'} 
          rounded-lg overflow-hidden aspect-square w-full
        `}
      >
        {isLoading && !error && !loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <i className={`ri-cube-line text-6xl ${theme === 'dark' ? 'text-gray-700' : 'text-gray-400'} mb-4`}></i>
            <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
              {t('threedviewer.loading')}
            </p>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <i className="ri-error-warning-line text-6xl text-red-500 mb-4"></i>
            <p className="text-gray-400 text-center px-4">{error}</p>
          </div>
        )}
      </div>
      
      {showControls && (
        <div className="absolute bottom-4 right-4">
          <div className={`
            rounded-full p-2 flex items-center space-x-2
            ${theme === 'dark' ? 'bg-black/60' : 'bg-gray-900/60'}
          `}>
            <button 
              className="text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/40"
              onClick={zoomIn}
              title={t('threedviewer.controls.zoomIn')}
            >
              <i className="ri-zoom-in-line"></i>
            </button>
            <button 
              className="text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/40"
              onClick={zoomOut}
              title={t('threedviewer.controls.zoomOut')}
            >
              <i className="ri-zoom-out-line"></i>
            </button>
            <button 
              className="text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/40"
              onClick={resetView}
              title={t('threedviewer.controls.reset')}
            >
              <i className="ri-refresh-line"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeDViewer;
