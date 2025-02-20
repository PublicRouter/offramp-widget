# Off-Ramp Widget

The **Off-Ramp Widget** seamlessly bridges traditional banking and crypto, enabling users to convert stablecoins into fiat with ease. Designed to leverage Privy’s email OTP wallets, this lightweight and configurable widget offers a user-friendly experience—ideal for non-crypto users who prefer simple email-based authentication. It supports streamlined KYC processes for users in Mexico and Argentina, with an enhanced verification flow available for US customers.

**Currently Using Base-Sepolia Testnet**

**Powered By:**

- [Blindpay](https://blindpay.com/)
- [Privy](https://www.privy.io/)

<br/>


## Key Features

- **Seamless Fiat Off-Ramp:** Convert stablecoins into fiat money efficiently.
- **User-Friendly Authentication:** Secure email OTP wallet access for users new to crypto.
- **Customizable and Lightweight:** Easily integrate and configure the widget for your application.
- **Flexible Payout Options:** Support multiple bank account types and delivery methods.

<br/>


## Payout Options and Estimated Arrival Times

| **Type**              | **Country**           | **Estimated Time of Arrival** |
| --------------------- | --------------------- | ----------------------------- |
| **ach**               | 🇺🇸 United States      | ~2 business days              |
| **wire**              | 🇺🇸 United States      | ~1 business day               |
| **pix**               | 🇧🇷 Brazil            | ~5 minutes                    |
| **spei_bitso**        | 🇲🇽 Mexico            | ~5 minutes                    |
| **ach_cop_bitso**     | 🇨🇴 Colombia          | ~1 business day               |
| **transfers_bitso**   | 🇦🇷 Argentina         | ~5 minutes                    |


<br/>

## Compliance and KYC Requirements

Every receiver must complete a KYC process to verify their identity. The widget supports two levels of verification: **KYC Light** and **KYC Standard**. Please note that **KYC Light** is not available for payouts in the United States.

<br/>


### KYC Light

*Applicable for individual receivers (except in the US).*

- First Name
- Last Name
- Date of Birth
- Email
- Country

<br/>


### KYC Standard

*Includes all fields from KYC Light plus additional details.*

- First Name
- Last Name
- Date of Birth
- Email
- Country
- Tax ID (government ID number)
- Address 1
- City
- State/Province/Region
- Postal Code
- **ID Document** – Type (passport, ID card, driver's license)
- **ID Document** – Front
- **ID Document** – Back


\* Fields marked with an asterisk (*) are optional depending on your regulatory requirements.


<br/>


## Preview
<img src="https://res.cloudinary.com/dw8cdzxiu/image/upload/v1739687285/Screenshot_2025-02-16_at_12.27.59_AM_rxuqwo.png" alt="Drag Racing" style="width: 50%; max-width: 250px;">
<img src="https://res.cloudinary.com/dw8cdzxiu/image/upload/v1739687306/Screenshot_2025-02-16_at_12.28.21_AM_gcfnyt.png" alt="Drag Racing" style="width: 50%; max-width: 250px;">
<img src="https://res.cloudinary.com/dw8cdzxiu/image/upload/v1739687337/Screenshot_2025-02-16_at_12.28.52_AM_acfqwv.png" alt="Drag Racing" style="width: 50%; max-width: 250px;">
<img src="https://res.cloudinary.com/dw8cdzxiu/image/upload/v1739687353/Screenshot_2025-02-16_at_12.29.09_AM_ne3lhy.png" alt="Drag Racing" style="width: 50%; max-width: 250px;">
<img src="https://res.cloudinary.com/dw8cdzxiu/image/upload/v1740077552/Screenshot_2025-02-20_at_12.52.26_PM_ayceaf.png" alt="Drag Racing" style="width: 50%; max-width: 250px;">
<img src="https://res.cloudinary.com/dw8cdzxiu/image/upload/v1740077650/Screenshot_2025-02-20_at_12.54.04_PM_qfgutp.png" alt="Drag Racing" style="width: 50%; max-width: 250px;">
<img src="https://res.cloudinary.com/dw8cdzxiu/image/upload/v1739687464/Screenshot_2025-02-16_at_12.31.01_AM_zg7zp4.png" alt="Drag Racing" style="width: 50%; max-width: 250px;">
<img src="https://res.cloudinary.com/dw8cdzxiu/image/upload/v1740077438/Screenshot_2025-02-20_at_12.47.39_PM_lyaxmn.png" alt="Drag Racing" style="width: 50%; max-width: 250px;">
<img src="https://res.cloudinary.com/dw8cdzxiu/image/upload/v1740077397/Screenshot_2025-02-20_at_12.47.55_PM_bm59s6.png" alt="Drag Racing" style="width: 50%; max-width: 250px;">
<img src="https://res.cloudinary.com/dw8cdzxiu/image/upload/v1740077386/Screenshot_2025-02-20_at_12.48.55_PM_mihbbk.png" alt="Drag Racing" style="width: 50%; max-width: 250px;">

<br/>

# How to Use

Below are the steps to set up your application using Privy and Smart Wallets with the Offramp widget.

---

## Step 1: Ensure Your Environment Variable is Set

Make sure you have the `NEXT_PUBLIC_PRIVY_APP_ID` environment variable configured. This variable initializes the Privy authentication within your application.

> **Tip:** Verify that your environment file (e.g., `.env.local`) includes:
>
> ```env
> NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
> ```

---

## Step 2: Create You Privy Provider Wrappers

Your application must be wrapped with both the `PrivyProvider` and the `SmartWalletsProvider`. This ensures that the Privy authentication context and smart wallets functionality are available throughout your app.

```jsx
'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { SmartWalletsProvider } from '@privy-io/react-auth/smart-wallets';
import { base } from 'viem/chains';

export default function MyPrivyProvider({ children }: { children: React.ReactNode; }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    throw new Error('Missing NEXT_PUBLIC_PRIVY_APP_ID environment variable');
  }

  console.log('Privy App ID:', appId);

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
          createOnLogin: 'users-without-wallets'
        }
      }}
    >
      <SmartWalletsProvider>{children}</SmartWalletsProvider>
    </PrivyProvider>
  );
}
```

---

## Step 3: Use the Privy Provider in Your RootLayout

Ensure that your application’s root layout wraps its children with `MyPrivyProvider` so that the Privy authentication context is available throughout your app.

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MyPrivyProvider from "@/providers/PrivyProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
        <MyPrivyProvider>
          {children}
        </MyPrivyProvider>
      </body>
    </html>
  );
}
```

## Step 4: Pass the Smart Wallets Client to Your Widget

Within your component that you will be using Offramp-Widget, use the `useSmartWallets` hook to obtain the smart wallets client and pass it to your widget. This allows the widget to interact with the user's smart wallet.

```jsx
'use client';
import React from 'react';
import { OfframpWidget } from 'offramp-widget';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';

export default function Widget() {
  const { client } = useSmartWallets();

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white">
      <main className="text-black">
        <OfframpWidget
          apiKey={'myapikey'}
          instanceId={'my_blindpay_instance_id'}
          baseUrl={'blindpay api baseUrl'}
          privySmartClient={client}
        />
      </main>
    </div>
  );
}
```

---

> **Sidenote:** Currently using a local server to hit API endpoints due to a CORS configuration issue on the current BlindPay API version -- this will be fixed soon.








