# Off-Ramp Widget

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A reusable React widget that bridges traditional banking and crypto, enabling users to convert stablecoins into fiat. Designed to leverage Privy's email OTP wallets, this lightweight and configurable widget offers a user-friendly experience ideal for non-crypto users who prefer simple email-based authentication. It supports streamlined KYC processes for users in Mexico, Argentina, and Brazil, with an enhanced verification flow available for US customers.

**Currently Using Base-Sepolia Testnet**

**Powered By:**

- [Blindpay](https://blindpay.com/)
- [Privy](https://www.privy.io/)

## Key Features

- **Seamless Fiat Off-Ramp:** Convert stablecoins into fiat money efficiently.
- **User-Friendly Authentication:** Secure email OTP wallet access for users new to crypto.
- **Customizable and Lightweight:** Easily integrate and configure the widget for your application.
- **Flexible Payout Options:** Support multiple bank account types and delivery methods.

## Preview

<img src="https://res.cloudinary.com/dw8cdzxiu/image/upload/v1739687285/Screenshot_2025-02-16_at_12.27.59_AM_rxuqwo.png" alt="Widget start screen" style="width: 50%; max-width: 250px;">
<img src="https://res.cloudinary.com/dw8cdzxiu/image/upload/v1739687306/Screenshot_2025-02-16_at_12.28.21_AM_gcfnyt.png" alt="KYC country selection" style="width: 50%; max-width: 250px;">
<img src="https://res.cloudinary.com/dw8cdzxiu/image/upload/v1739687337/Screenshot_2025-02-16_at_12.28.52_AM_acfqwv.png" alt="KYC verification form" style="width: 50%; max-width: 250px;">
<img src="https://res.cloudinary.com/dw8cdzxiu/image/upload/v1739687353/Screenshot_2025-02-16_at_12.29.09_AM_ne3lhy.png" alt="KYC form fields" style="width: 50%; max-width: 250px;">
<img src="https://res.cloudinary.com/dw8cdzxiu/image/upload/v1740077552/Screenshot_2025-02-20_at_12.52.26_PM_ayceaf.png" alt="Receiver dashboard with bank accounts" style="width: 50%; max-width: 250px;">
<img src="https://res.cloudinary.com/dw8cdzxiu/image/upload/v1740077650/Screenshot_2025-02-20_at_12.54.04_PM_qfgutp.png" alt="Bank account details and withdrawal quote" style="width: 50%; max-width: 250px;">
<img src="https://res.cloudinary.com/dw8cdzxiu/image/upload/v1739687464/Screenshot_2025-02-16_at_12.31.01_AM_zg7zp4.png" alt="Add bank account form" style="width: 50%; max-width: 250px;">
<img src="https://res.cloudinary.com/dw8cdzxiu/image/upload/v1740077438/Screenshot_2025-02-20_at_12.47.39_PM_lyaxmn.png" alt="Payout confirmation screen" style="width: 50%; max-width: 250px;">
<img src="https://res.cloudinary.com/dw8cdzxiu/image/upload/v1740077397/Screenshot_2025-02-20_at_12.47.55_PM_bm59s6.png" alt="Transaction approval prompt" style="width: 50%; max-width: 250px;">
<img src="https://res.cloudinary.com/dw8cdzxiu/image/upload/v1740077386/Screenshot_2025-02-20_at_12.48.55_PM_mihbbk.png" alt="Transaction confirmation result" style="width: 50%; max-width: 250px;">

## Installation

```bash
npm install offramp-widget
```

## Quick Start

### Step 1: Set Your Environment Variable

Copy the example environment file and fill in your Privy App ID:

```bash
cp .env.example .env.local
```

> Your `.env.local` should contain:
>
> ```env
> NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
> ```

---

### Step 2: Create Your Privy Provider Wrappers

Your application must be wrapped with both the `PrivyProvider` and the `SmartWalletsProvider`. This ensures that the Privy authentication context and smart wallets functionality are available throughout your app.

```jsx
'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { SmartWalletsProvider } from '@privy-io/react-auth/smart-wallets';
import { base } from 'viem/chains';

export default function MyPrivyProvider({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    throw new Error('Missing NEXT_PUBLIC_PRIVY_APP_ID environment variable');
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        defaultChain: base,
        appearance: {
          theme: 'light',
          accentColor: '#000000',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <SmartWalletsProvider>{children}</SmartWalletsProvider>
    </PrivyProvider>
  );
}
```

---

### Step 3: Wrap Your Root Layout

Ensure that your application's root layout wraps its children with `MyPrivyProvider` so that the Privy authentication context is available throughout your app.

```tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import MyPrivyProvider from '@/providers/PrivyProvider';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My App',
  description: 'Crypto off-ramp powered by BlindPay',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        <MyPrivyProvider>{children}</MyPrivyProvider>
      </body>
    </html>
  );
}
```

---

### Step 4: Pass the Smart Wallets Client to Your Widget

Use the `useSmartWallets` hook to obtain the smart wallets client and pass it to the widget. This allows the widget to interact with the user's smart wallet for transaction signing.

```jsx
'use client';

import { OfframpWidget } from 'offramp-widget';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';

export default function Widget() {
  const { client } = useSmartWallets();

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white">
      <OfframpWidget
        apiKey="your_blindpay_api_key"
        instanceId="your_blindpay_instance_id"
        baseUrl="https://api.blindpay.com"
        privySmartClient={client}
      />
    </div>
  );
}
```

## Payout Options

| Type                | Country              | Estimated Arrival  |
| ------------------- | -------------------- | ------------------ |
| **ach**             | 🇺🇸 United States   | ~2 business days   |
| **wire**            | 🇺🇸 United States   | ~1 business day    |
| **pix**             | 🇧🇷 Brazil          | ~5 minutes         |
| **spei_bitso**      | 🇲🇽 Mexico          | ~5 minutes         |
| **ach_cop_bitso**   | 🇨🇴 Colombia        | ~1 business day    |
| **transfers_bitso** | 🇦🇷 Argentina       | ~5 minutes         |

## KYC Requirements

Every receiver must complete a KYC process to verify their identity. The widget supports two levels of verification: **KYC Light** and **KYC Standard**. KYC Light is not available for payouts in the United States.

### KYC Light

*For individual receivers (except US).*

- First Name, Last Name, Date of Birth, Email, Country

### KYC Standard

*Includes all KYC Light fields plus:*

- Tax ID (government ID number)
- Phone Number
- Address, City, State/Province/Region, Postal Code
- ID Document — Type (passport, ID card, driver's license), Front image

## License

[MIT](LICENSE)
