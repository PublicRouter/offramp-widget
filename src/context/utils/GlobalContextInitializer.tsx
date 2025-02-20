import { useEffect } from 'react';
import { useGlobalContext } from '../GlobalContext';

interface GlobalContextInitializerProps {
  privySmartClient: any;
}

const GlobalContextInitializer = ({
  privySmartClient
}: GlobalContextInitializerProps) => {
  const { data, setData } = useGlobalContext();

  useEffect(() => {
    // Only update if the value is not already set
    if (data.privySmartClient !== privySmartClient) {
      setData('privySmartClient', privySmartClient);
    }
    // We intentionally leave out data here if privySmartClient is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [privySmartClient, setData]);

  return null;
};

export default GlobalContextInitializer;
