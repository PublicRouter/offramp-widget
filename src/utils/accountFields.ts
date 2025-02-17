// src/utils/accountFields.ts

interface AccountField {
  name: string;
  label: string;
  required: boolean;
}

export const accountFieldsMapping: Record<string, AccountField[]> = {
  pix: [
    { name: 'name', label: 'Bank Account Name', required: true },
    { name: 'pix_key', label: 'Pix Key', required: true }
  ],
  ach: [
    { name: 'name', label: 'Bank Account Name', required: true },
    { name: 'beneficiary_name', label: 'Beneficiary Name', required: true },
    { name: 'account_number', label: 'Account Number', required: true },
    { name: 'routing_number', label: 'Routing Number', required: true },
    { name: 'account_type', label: 'Account Type', required: true },
    { name: 'account_class', label: 'Account Class', required: false }
  ],
  wire: [
    { name: 'name', label: 'Bank Account Name', required: true },
    { name: 'beneficiary_name', label: 'Beneficiary Name', required: true },
    { name: 'account_number', label: 'Account Number', required: true },
    { name: 'routing_number', label: 'Routing Number', required: true },
    { name: 'address_line_1', label: 'Address Line 1', required: true },
    { name: 'address_line_2', label: 'Address Line 2', required: false },
    { name: 'city', label: 'City', required: true },
    {
      name: 'state_province_region',
      label: 'State/Province/Region',
      required: true
    },
    { name: 'country', label: 'Country', required: true },
    { name: 'postal_code', label: 'Postal Code', required: true }
  ],
  spei_bitso: [
    { name: 'name', label: 'Bank Account Name', required: true },
    { name: 'beneficiary_name', label: 'Beneficiary Name', required: true },
    { name: 'spei_protocol', label: 'SPEI Protocol', required: true },
    {
      name: 'spei_institution_code',
      label: 'SPEI Institution Code',
      required: true
    },
    { name: 'spei_clabe', label: 'SPEI CLABE', required: true }
  ],
  ach_cop_bitso: [
    { name: 'name', label: 'Bank Account Name', required: true },
    { name: 'account_type', label: 'Account Type', required: true },
    {
      name: 'ach_cop_beneficiary_first_name',
      label: 'First Name',
      required: true
    },
    {
      name: 'ach_cop_beneficiary_last_name',
      label: 'Last Name',
      required: true
    },
    { name: 'ach_cop_document_id', label: 'Document ID', required: true },
    { name: 'ach_cop_document_type', label: 'Document Type', required: true },
    { name: 'ach_cop_email', label: 'Email', required: true },
    { name: 'ach_cop_bank_code', label: 'Bank Code', required: true },
    { name: 'ach_cop_bank_account', label: 'Bank Account', required: true }
  ],
  transfers_bitso: [
    { name: 'name', label: 'Bank Account Name', required: true },
    { name: 'beneficiary_name', label: 'Beneficiary Name', required: true },
    { name: 'transfers_type', label: 'Transfer Type', required: true },
    { name: 'transfers_account', label: 'Transfer Account', required: true }
  ]
};
