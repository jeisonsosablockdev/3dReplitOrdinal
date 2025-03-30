import { useTranslation } from 'react-i18next';
import { MINTING_STEPS } from '@/lib/constants';
import { useTheme } from '@/lib/context/ThemeContext';

interface MintingStepsProps {
  currentStep: number;
}

const MintingSteps = ({ currentStep }: MintingStepsProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center justify-between mb-8 px-4">
      {MINTING_STEPS.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-bold
              ${step.id === currentStep 
                ? 'bg-primary text-black' 
                : step.id < currentStep 
                  ? 'bg-success text-white' 
                  : theme === 'dark'
                    ? `bg-surface ${step.id === currentStep + 1 ? 'border-2 border-primary text-white' : 'text-gray-400'}`
                    : `bg-gray-100 ${step.id === currentStep + 1 ? 'border-2 border-primary text-gray-900' : 'text-gray-400'}`
              }
            `}>
              {step.id < currentStep ? (
                <i className="ri-check-line"></i>
              ) : (
                step.id
              )}
            </div>
            <span className={`
              text-sm mt-2
              ${step.id <= currentStep 
                ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }
            `}>
              {t(`mint.steps.${step.name.toLowerCase()}`)}
            </span>
          </div>
          
          {index < MINTING_STEPS.length - 1 && (
            <div className={`h-1 flex-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} mx-2`}>
              <div 
                className={`h-full ${step.id < currentStep ? 'bg-success' : 'bg-primary'}`}
                style={{ width: step.id < currentStep ? '100%' : step.id === currentStep ? '50%' : '0%' }}
              ></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MintingSteps;
