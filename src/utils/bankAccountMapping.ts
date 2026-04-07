export const bankAccountTypeMapping: Record<
  string,
  { country: string; currency: string; flag: string; estimatedTime: string }
> = {
  ach: {
    country: 'United States',
    currency: 'USD',
    flag: '\u{1F1FA}\u{1F1F8}',
    estimatedTime: '~2 business days',
  },
  wire: {
    country: 'United States',
    currency: 'USD',
    flag: '\u{1F1FA}\u{1F1F8}',
    estimatedTime: '~1 business day',
  },
  pix: {
    country: 'Brazil',
    currency: 'BRL',
    flag: '\u{1F1E7}\u{1F1F7}',
    estimatedTime: '~5 minutes',
  },
  spei_bitso: {
    country: 'Mexico',
    currency: 'MXN',
    flag: '\u{1F1F2}\u{1F1FD}',
    estimatedTime: '~5 minutes',
  },
  ach_cop_bitso: {
    country: 'Colombia',
    currency: 'COP',
    flag: '\u{1F1E8}\u{1F1F4}',
    estimatedTime: '~1 business day',
  },
  transfers_bitso: {
    country: 'Argentina',
    currency: 'ARS',
    flag: '\u{1F1E6}\u{1F1F7}',
    estimatedTime: '~5 minutes',
  },
};

export const getBankAccountDetails = (type: string) => {
  return (
    bankAccountTypeMapping[type] || {
      country: 'Unknown',
      currency: 'Unknown',
      flag: '\u{1F3F3}\u{FE0F}',
      estimatedTime: 'Unknown',
    }
  );
};
