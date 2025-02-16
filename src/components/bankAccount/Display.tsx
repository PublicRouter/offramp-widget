import React, { useState } from 'react';
import { CiCirclePlus } from 'react-icons/ci';
import { CiCircleMinus } from 'react-icons/ci';

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

interface DisplayProps {
  bankAccounts: BankAccount[];
  onAddClick: () => void;
  onRemoveClick: () => void;
  loading: boolean;
}

const Display: React.FC<DisplayProps> = ({
  bankAccounts,
  onAddClick,
  onRemoveClick,
  loading
}) => {
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(
    null
  );

  const toggleAccountDetails = (accountId: string) => {
    setExpandedAccountId((prevId) => (prevId === accountId ? null : accountId));
  };

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
              className="bg-white rounded-lg shadow-md p-4 border"
            >
              <div
                className="flex justify-between items-start cursor-pointer"
                onClick={() => toggleAccountDetails(account.id)}
              >
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
                    e.stopPropagation(); // Prevent triggering the toggle
                    onRemoveClick();
                  }}
                >
                  <CiCircleMinus size={30} />
                </button>
              </div>

              {expandedAccountId === account.id && (
                <div className="mt-4 text-sm text-gray-600">
                  {account.type === 'pix' && (
                    <p className="mb-2">
                      <strong>Pix Key:</strong> {account.pix_key}
                    </p>
                  )}
                  {account.account_type && (
                    <p className="mb-2">
                      <strong>Account Type:</strong> {account.account_type}
                    </p>
                  )}
                  {account.routing_number && (
                    <p className="mb-2">
                      <strong>Routing Number:</strong> {account.routing_number}
                    </p>
                  )}
                  {account.beneficiary_name && (
                    <p className="mb-2">
                      <strong>Beneficiary Name:</strong>{' '}
                      {account.beneficiary_name}
                    </p>
                  )}
                  {/* Add more fields as needed */}
                </div>
              )}
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

export default Display;
