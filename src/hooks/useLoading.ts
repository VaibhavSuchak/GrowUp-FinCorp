import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  text?: string;
  type?: 'dots' | 'wave' | 'ring' | 'morph' | 'financial' | 'sparkle' | 'gradient';
}

export const useLoading = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
  });

  const showLoading = useCallback((
    text?: string,
    type?: LoadingState['type']
  ) => {
    setLoadingState({
      isLoading: true,
      text: text || 'Loading...',
      type: type || 'dots',
    });
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingState({
      isLoading: false,
    });
  }, []);

  const setLoading = useCallback((
    isLoading: boolean,
    text?: string,
    type?: LoadingState['type']
  ) => {
    setLoadingState({
      isLoading,
      text: isLoading ? (text || 'Loading...') : undefined,
      type: isLoading ? type : undefined,
    });
  }, []);

  return {
    ...loadingState,
    showLoading,
    hideLoading,
    setLoading,
  };
};
