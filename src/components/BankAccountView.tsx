import React, { useState } from 'react';
import { CiCirclePlus, CiCircleMinus } from 'react-icons/ci';

interface BankAccount {
  id: string;
  type: string;
  name: string;
  pix_key: string | null;
  beneficiary_name: string | null;
  routing_number: string | null;
  account_number: string | null;
  account_type: string | null;
  account_class: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state_province_region: string | null;
  country: string | null;
  postal_code: string | null;
  blockchain_address: {
    sepolia: string | null;
    arbitrum_sepolia: string | null;
    base_sepolia: string | null;
    polygon_amoy: string | null;
    base: string | null;
    arbitrum: string | null;
    polygon: string | null;
  };
}

interface BankAccountViewProps {
  bankAccounts: BankAccount[];
  onAddClick: () => void;
  onRemoveClick: () => void;
  loading: boolean;
  onBankAccountClick: (bankAccount: any) => void;
}

const BankAccountView: React.FC<BankAccountViewProps> = ({
  bankAccounts,
  onAddClick,
  onRemoveClick,
  loading,
  onBankAccountClick
}) => {
  return (
    <section className="space-y-6 w-full">
      {!loading && bankAccounts && bankAccounts.length === 0 && (
        <p className="text-center text-gray-500 border px-2 py-1">
          No bank accounts found.
        </p>
      )}
      {bankAccounts && bankAccounts.length > 0 && (
        <div className="space-y-4">
          {bankAccounts.map((account) => (
            <div
              key={account.id}
              className="bg-white rounded-lg shadow-md p-4 border cursor-pointer"
              onClick={() => onBankAccountClick(account)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <strong className="text-md text-gray-700">
                    {account.name}
                  </strong>
                  <p className="text-sm text-gray-500">
                    Account Type: {account.type}
                  </p>
                </div>
                <button
                  className="text-red-700 hover:text-red-400 px-2 py-1 rounded-md font-semibold text-md hover:cursor-pointer hover:scale-[1.05]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveClick();
                  }}
                >
                  <CiCircleMinus size={30} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-start gap-6 mt-6">
        <button
          onClick={onAddClick}
          className="text-black p-3 rounded-md transition-all hover:scale-[1.01] hover:cursor-pointer flex gap-2 justify-center items-center"
        >
          <CiCirclePlus size={30} />
          Add Bank Account
        </button>
      </div>
    </section>
  );
};

export default BankAccountView;
