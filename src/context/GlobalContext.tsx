// /src/context/GlobalContext.tsx

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the types for possible data items
interface DataStore {
  [key: string]: any; // This allows the store to hold data of any type with a string key
}

interface GlobalContextType {
  data: DataStore;
  setData: (key: string, value: any) => void;
}

// Create the context
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Provider component to wrap around your app and provide the context
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<DataStore>({});

  // Function to update data in the store
  const updateData = (key: string, value: any) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value
    }));
  };

  return (
    <GlobalContext.Provider value={{ data, setData: updateData }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Hook to use the context
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
