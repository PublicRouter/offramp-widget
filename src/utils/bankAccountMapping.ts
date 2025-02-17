// Define the mappings for bank account types
export const bankAccountTypeMapping: Record<
  string,
  { country: string; currency: string; flag: string; estimatedTime: string }
> = {
  ach: {
    country: 'United States',
    currency: 'USD',
    flag: '🇺🇸',
    estimatedTime: '~2 business days'
  },
  wire: {
    country: 'United States',
    currency: 'USD',
    flag: '🇺🇸',
    estimatedTime: '~1 business day'
  },
  pix: {
    country: 'Brazil',
    currency: 'BRL',
    flag: '🇧🇷',
    estimatedTime: '~5 minutes'
  },
  spei_bitso: {
    country: 'Mexico',
    currency: 'MXN',
    flag: '🇲🇽',
    estimatedTime: '~5 minutes'
  },
  ach_cop_bitso: {
    country: 'Colombia',
    currency: 'COP',
    flag: '🇨🇴',
    estimatedTime: '~1 business day'
  },
  transfers_bitso: {
    country: 'Argentina',
    currency: 'ARS',
    flag: '🇦🇷',
    estimatedTime: '~5 minutes'
  }
};

// Function to get the country, currency, and flag for the bank account type
export const getBankAccountDetails = (
  type: keyof typeof bankAccountTypeMapping
) => {
  return (
    bankAccountTypeMapping[type] || {
      country: 'Unknown',
      currency: 'Unknown',
      flag: '🏳️',
      estimatedTime: 'Unknown'
    }
  );
};
