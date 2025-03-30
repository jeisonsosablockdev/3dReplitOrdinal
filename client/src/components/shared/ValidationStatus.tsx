import { useTranslation } from 'react-i18next';
import { ValidationResult } from '@/lib/types';
import { useTheme } from '@/lib/context/ThemeContext';

interface ValidationStatusProps {
  isValidating: boolean;
  validationResult?: ValidationResult;
}

const ValidationStatus = ({ isValidating, validationResult }: ValidationStatusProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  if (!isValidating && !validationResult) return null;
  
  let icon = 'ri-loader-4-line animate-spin';
  let title = t('mint.validationStatus.validating');
  let description = t('mint.validationStatus.checking');
  let statusColor = 'text-primary';
  
  if (!isValidating && validationResult) {
    if (validationResult.valid) {
      icon = 'ri-checkbox-circle-line';
      title = t('mint.validationStatus.valid');
      description = validationResult.message;
      statusColor = 'text-success';
    } else {
      icon = 'ri-error-warning-line';
      title = t('mint.validationStatus.invalid');
      description = validationResult.message;
      statusColor = 'text-error';
    }
  }
  
  return (
    <div className={`
      mb-6 p-4 rounded-lg border
      ${theme === 'dark' 
        ? 'border-gray-700 bg-gray-800/50' 
        : 'border-gray-200 bg-gray-100/50'
      }
    `}>
      <div className="flex items-center">
        <div className={`mr-4 ${statusColor}`}>
          <i className={`${icon} text-xl`}></i>
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ValidationStatus;
