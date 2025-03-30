import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { API_ENDPOINTS } from '@/lib/constants';
import { ValidationResult, Ordinal, ApiResponse } from '@/lib/types';
import { useWallet } from '@/lib/context/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export const useOrdinalValidation = (collectionId?: string) => {
  const [file, setFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const { wallet } = useWallet();
  const { toast } = useToast();
  const { t } = useTranslation();

  const validateMutation = useMutation({
    mutationFn: async (formData: FormData): Promise<ValidationResult> => {
      const response = await apiRequest('POST', API_ENDPOINTS.VALIDATE_ORDINAL, formData);
      const data: ApiResponse<ValidationResult> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Validation failed');
      }
      
      return data.data as ValidationResult;
    },
    onSuccess: (data) => {
      if (!data.valid) {
        toast({
          title: t('validation.invalid'),
          description: data.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('validation.valid'),
          description: t('validation.validOrdinal', { collection: data.ordinal?.collection.name }),
        });
      }
    },
    onError: (error) => {
      toast({
        title: t('validation.error'),
        description: (error as Error).message,
        variant: 'destructive',
      });
    },
  });

  const validateOrdinal = async (uploadedFile: File): Promise<ValidationResult | null> => {
    if (!wallet.connected) {
      toast({
        title: t('wallet.notConnected'),
        description: t('wallet.connectFirst'),
        variant: 'destructive',
      });
      return null;
    }

    setFile(uploadedFile);
    setIsValidating(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('wallet', wallet.address || '');
      
      if (collectionId) {
        formData.append('collectionId', collectionId);
      }

      const result = await validateMutation.mutateAsync(formData);
      return result;
    } catch (error) {
      console.error('Validation error:', error);
      return null;
    } finally {
      setIsValidating(false);
    }
  };

  return {
    file,
    setFile,
    isValidating: isValidating || validateMutation.isPending,
    validateOrdinal,
    validationResult: validateMutation.data,
    validationError: validateMutation.error,
  };
};

export const useOrdinalById = (id?: string) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.GET_ORDINAL, id],
    queryFn: async () => {
      if (!id) return null;
      const response = await fetch(`${API_ENDPOINTS.GET_ORDINAL}${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch ordinal');
      }
      const data = await response.json();
      return data.data as Ordinal;
    },
    enabled: !!id,
  });
};
