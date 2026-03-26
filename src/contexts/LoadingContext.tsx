import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface LoadingState {
  isLoading: boolean;
  text?: string;
  type?: 'dots' | 'wave' | 'ring' | 'morph' | 'financial' | 'sparkle' | 'gradient' | 'branded';
}

interface LoadingContextType extends LoadingState {
  showLoading: (text?: string, type?: LoadingState['type']) => void;
  hideLoading: () => void;
  setLoading: (isLoading: boolean, text?: string, type?: LoadingState['type']) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
  });

  const showLoading = useCallback((
    text?: string,
    type?: LoadingState['type']
  ) => {
    setLoadingState({
      isLoading: true,
      text: text || '',
      type: type || 'branded',
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

  const value: LoadingContextType = {
    ...loadingState,
    showLoading,
    hideLoading,
    setLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoadingContext = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoadingContext must be used within a LoadingProvider');
  }
  return context;
};
