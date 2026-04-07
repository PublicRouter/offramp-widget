import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { GlobalState, Receiver, SmartWalletClient } from '../types';

interface GlobalContextType {
  state: GlobalState;
  setReceiver: (receiver: Receiver | null) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
  privySmartClient: SmartWalletClient | null;
}

export const GlobalProvider = ({ children, privySmartClient }: GlobalProviderProps) => {
  const [state, setState] = useState<GlobalState>({
    receiver: null,
    privySmartClient: null,
  });

  useEffect(() => {
    setState((prev) => {
      if (prev.privySmartClient === privySmartClient) return prev;
      return { ...prev, privySmartClient };
    });
  }, [privySmartClient]);

  const setReceiver = (receiver: Receiver | null) => {
    setState((prev) => ({ ...prev, receiver }));
  };

  return (
    <GlobalContext.Provider value={{ state, setReceiver }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
