// /src/index.tsx (main file that someone consuming this npm package would import)

//! when using widget -
//! 1. withdraw amount should be in 

import { GlobalProvider } from './context/GlobalContext';
import { ApiProvider } from './context/ApiContext';
import { Widget } from './components';
import './index.css';

interface OfframpWidgetProps {
  apiKey: string;
  instanceId: string;
  baseUrl: string;
}

// Main entry point for the package
function OfframpWidget({ apiKey, instanceId, baseUrl }: OfframpWidgetProps) {
  //!temporary, the consuming application should set authdEmail themselves after actually authenticating a user to login with email(privy OTP, etc)
  sessionStorage.setItem('authdEmail', 'test@proton.me');
  return (
    <GlobalProvider>
      {' '}
      {/* GlobalContext if needed */}
      <ApiProvider instanceId={instanceId} baseUrl={baseUrl} apiKey={apiKey}>
        <Widget /> {/* The Widget should be wrapped with ApiProvider */}
      </ApiProvider>
    </GlobalProvider>
  );
}

export { OfframpWidget };
