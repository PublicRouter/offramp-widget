export type KycField = {
  name: string;
  label: string;
  type: 'text' | 'date' | 'email' | 'file' | 'select';
  required: boolean;
  options?: { value: string; label: string }[];
};

export type KycMapping = {
  individual: KycField[];
  business: KycField[];
};

export type KycTypeMapping = {
  light: KycMapping;
  standard: KycMapping;
  enhanced: KycMapping;
};

export const kycMappings: KycTypeMapping = {
  light: {
    individual: [
      { name: 'first_name', label: 'First Name', type: 'text', required: true },
      { name: 'last_name', label: 'Last Name', type: 'text', required: true },
      {
        name: 'date_of_birth',
        label: 'Date of Birth',
        type: 'date',
        required: true
      },
      { name: 'email', label: 'Email', type: 'email', required: true }
      // Note: light mapping here includes only basic fields.
    ],
    business: [
      { name: 'legal_name', label: 'Legal Name', type: 'text', required: true },
      {
        name: 'tax_id',
        label: 'Tax ID (government id number)',
        type: 'text',
        required: true
      },
      {
        name: 'date_of_formation',
        label: 'Formation Date',
        type: 'date',
        required: true
      },
      { name: 'email', label: 'Email', type: 'email', required: true }
    ]
  },
  standard: {
    individual: [
      // Inherit basic fields from light then add additional ones:
      { name: 'first_name', label: 'First Name', type: 'text', required: true },
      { name: 'last_name', label: 'Last Name', type: 'text', required: true },
      {
        name: 'date_of_birth',
        label: 'Date of Birth',
        type: 'date',
        required: true
      },
      { name: 'email', label: 'Email', type: 'email', required: true },
      // Standard additional fields:
      { name: 'tax_id', label: 'Tax ID', type: 'text', required: true },
      {
        name: 'phone_number',
        label: 'Phone Number',
        type: 'text',
        required: true
      },
      {
        name: 'address1',
        label: 'Address Line 1',
        type: 'text',
        required: true
      },
      { name: 'city', label: 'City', type: 'text', required: true },
      {
        name: 'state',
        label: 'State/Province/Region',
        type: 'text',
        required: true
      },
      {
        name: 'postal_code',
        label: 'Postal Code',
        type: 'text',
        required: true
      },
      {
        name: 'id_document_country',
        label: 'ID Document Country',
        type: 'select',
        required: true,
        options: [
          { value: 'US', label: 'US' },
          { value: 'MX', label: 'Mexico' },
          { value: 'AR', label: 'Argentina' }
          // Extend as needed.
        ]
      },
      {
        name: 'id_document_type',
        label: 'ID Document Type',
        type: 'select',
        required: true,
        options: [
          { value: 'passport', label: 'Passport' },
          { value: 'id_card', label: 'ID Card' },
          { value: 'drivers_license', label: "Driver's License" }
        ]
      },
      {
        name: 'id_document_front',
        label: 'ID Document Front',
        type: 'file',
        required: true
      }
    ],
    business: [
      // Define business standard fields as needed.
    ]
  },
  enhanced: {
    individual: [
      // All standard fields plus enhanced ones.
      { name: 'first_name', label: 'First Name', type: 'text', required: true },
      { name: 'last_name', label: 'Last Name', type: 'text', required: true },
      {
        name: 'date_of_birth',
        label: 'Date of Birth',
        type: 'date',
        required: true
      },
      { name: 'email', label: 'Email', type: 'email', required: true },
      // Enhanced additional fields:
      { name: 'tax_id', label: 'Tax ID', type: 'text', required: true },
      {
        name: 'phone_number',
        label: 'Phone Number',
        type: 'text',
        required: true
      },
      {
        name: 'address1',
        label: 'Address Line 1',
        type: 'text',
        required: true
      },
      { name: 'city', label: 'City', type: 'text', required: true },
      {
        name: 'state',
        label: 'State/Province/Region',
        type: 'text',
        required: true
      },
      {
        name: 'postal_code',
        label: 'Postal Code',
        type: 'text',
        required: true
      },
      {
        name: 'id_document_country',
        label: 'ID Document Country',
        type: 'select',
        required: true,
        options: [
          { value: 'BR', label: 'Brazil' }
          // Extend as needed.
        ]
      },
      {
        name: 'id_document_type',
        label: 'ID Document Type',
        type: 'select',
        required: true,
        options: [
          { value: 'passport', label: 'Passport' },
          { value: 'id_card', label: 'ID Card' },
          { value: 'drivers_license', label: "Driver's License" }
        ]
      },
      {
        name: 'id_document_front',
        label: 'ID Document Front',
        type: 'file',
        required: true
      },
      // Enhanced fields:
      {
        name: 'source_of_funds_document_type',
        label: 'Source of Funds Document Type',
        type: 'select',
        required: true,
        options: [
          { value: 'business_income', label: 'Business Income' },
          { value: 'gambling_proceeds', label: 'Gambling Proceeds' },
          { value: 'gifts', label: 'Gifts' },
          { value: 'government_benefits', label: 'Government Benefits' },
          { value: 'inheritance', label: 'Inheritance' }
        ]
      },
      {
        name: 'source_of_funds_document_file',
        label: 'Source of Funds Document File',
        type: 'file',
        required: true
      },
      {
        name: 'individual_holding_document_front_file',
        label: 'Individual Holding Document Front File',
        type: 'file',
        required: true
      },
      {
        name: 'purpose_of_transactions',
        label: 'Purpose of Transactions',
        type: 'select',
        required: true,
        options: [
          { value: 'business_transactions', label: 'Business Transactions' },
          { value: 'charitable_donations', label: 'Charitable Donations' },
          { value: 'investment_purposes', label: 'Investment Purposes' },
          {
            value: 'payments_to_friends_or_family_abroad',
            label: 'Payments to Friends/Family Abroad'
          },
          {
            value: 'personal_or_living_expenses',
            label: 'Personal or Living Expenses'
          }
        ]
      },
      {
        name: 'purpose_of_transactions_explanation',
        label: 'Purpose of Transactions Explanation',
        type: 'text',
        required: true
      }
    ],
    business: [
      // Define business enhanced fields as needed.
    ]
  }
};

export type PayoutLimits = {
  per_transaction: number;
  daily: number;
  monthly: number;
};

export const payoutLimits = {
  light: { per_transaction: 1000, daily: 2000, monthly: 10000 },
  kybLight: { per_transaction: 3000, daily: 6000, monthly: 15000 },
  standard: { per_transaction: 10000, daily: 50000, monthly: 100000 },
  kybStandard: { per_transaction: 30000, daily: 100000, monthly: 250000 },
  enhanced: { per_transaction: 50000, daily: 100000, monthly: 500000 }
};
