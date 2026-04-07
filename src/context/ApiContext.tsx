import { createContext, useContext, type ReactNode, useState, useEffect } from 'react';
import Api from '../api';

interface ApiContextType {
  api: Api | null;
  initialized: boolean;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  baseUrl: string;
  instanceId: string;
  apiKey: string;
  children: ReactNode;
}

export const ApiProvider = ({ baseUrl, instanceId, apiKey, children }: ApiProviderProps) => {
  const [api, setApi] = useState<Api | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const instance = new Api(baseUrl, instanceId, apiKey);
    setApi(instance);
    setInitialized(true);
  }, [baseUrl, instanceId, apiKey]);

  return (
    <ApiContext.Provider value={{ api, initialized }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
