import { GlobalProvider } from './context/GlobalContext';
import { ApiProvider } from './context/ApiContext';
import { Widget } from './components';
import type { SmartWalletClient } from './types';
import './index.css';

export interface OfframpWidgetProps {
  apiKey: string;
  instanceId: string;
  baseUrl: string;
  privySmartClient: SmartWalletClient | null;
}

function OfframpWidget({ apiKey, instanceId, baseUrl, privySmartClient }: OfframpWidgetProps) {
  return (
    <GlobalProvider privySmartClient={privySmartClient}>
      <ApiProvider instanceId={instanceId} baseUrl={baseUrl} apiKey={apiKey}>
        <Widget />
      </ApiProvider>
    </GlobalProvider>
  );
}

export { OfframpWidget };
export type { SmartWalletClient };
