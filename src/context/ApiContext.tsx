import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect
} from 'react';
import Api from '../api'; // Import the Api class

// Define the context type
interface ApiContextType {
  api: Api | null;
  initialized: boolean; // Flag to track if the API has been initialized
}

// Create the context
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Provider component to wrap around your app and provide the API context
export const ApiProvider = ({
  baseUrl,
  instanceId,
  apiKey,
  children
}: {
  baseUrl: string;
  instanceId: string;
  apiKey: string;
  children: ReactNode;
}) => {
  const [api, setApi] = useState<Api | null>(null); // Initialize `api` as `null`
  const [initialized, setInitialized] = useState(false); // Flag to track initialization

  useEffect(() => {
    if (!api) {
      console.log('Initializing API with', baseUrl, instanceId, apiKey); // Debug log to see initialization
      const apiInstance = Api.getInstance(baseUrl, instanceId, apiKey); // Initialize only once
      setApi(apiInstance);
      setInitialized(true); // Once the API is set, mark as initialized
    }
  }, [baseUrl, instanceId, apiKey, api]); // This effect runs only once on initial mount

  return (
    <ApiContext.Provider value={{ api, initialized }}>
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook to access the API context
export const useApi = (): { api: Api | null; initialized: boolean } => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
