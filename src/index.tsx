// /src/index.tsx
import { GlobalProvider } from './context/GlobalContext';
import { ApiProvider } from './context/ApiContext';
import { Widget } from './components';
import GlobalContextInitializer from './context/utils/GlobalContextInitializer';
import './index.css';

interface OfframpWidgetProps {
  apiKey: string;
  instanceId: string;
  baseUrl: string;
  privySmartClient: any;
}

// Main entry point for the package
function OfframpWidget({
  apiKey,
  instanceId,
  baseUrl,
  privySmartClient
}: OfframpWidgetProps) {
  return (
    <GlobalProvider>
      {/* Initialize global context with privySmartClient */}
      <GlobalContextInitializer privySmartClient={privySmartClient} />
      <ApiProvider
        instanceId={instanceId}
        baseUrl={baseUrl}
        apiKey={apiKey}
      >
        <Widget />
      </ApiProvider>
    </GlobalProvider>
  );
}

export { OfframpWidget };
