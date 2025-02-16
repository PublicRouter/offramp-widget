import React, { useState } from 'react';
import { useApi } from '../../context/ApiContext';
import { IoIosCloseCircleOutline } from 'react-icons/io';

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

interface RemoveBankAccountFormProps {
  receiverId: string;
  bankAccounts: BankAccount[];
  onSubmit: () => void; // Callback to refetch or update the bank accounts list
  onCancel: () => void; // Callback to close the form
}

const RemoveBankAccountForm: React.FC<RemoveBankAccountFormProps> = ({
  receiverId,
  bankAccounts,
  onSubmit,
  onCancel
}) => {
  const [selectedBankAccountName, setSelectedBankAccountName] = useState('');
  const [isRemoveEnabled, setIsRemoveEnabled] = useState(false);
  const [isRemovingAccount, setIsRemovingAccount] = useState(false);
  const { api } = useApi();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setSelectedBankAccountName(name);

    // Enable remove button if bank account name matches
    const matchingAccount = bankAccounts.find(
      (account) => account.name === name
    );
    setIsRemoveEnabled(!!matchingAccount);
  };

  const handleRemove = async () => {
    if (!selectedBankAccountName) return; // Make sure there's a name

    setIsRemovingAccount(true); // Set loading state to true
    const matchingAccount = bankAccounts.find(
      (account) => account.name === selectedBankAccountName
    );

    if (matchingAccount) {
      try {
        const response = await api?.deleteBankAccount(
          receiverId,
          matchingAccount.id
        );
        if (response.error == null) {
          onSubmit(); // Trigger refetch or state update in parent
          onCancel(); // Close the form after successful deletion
        } else {
          console.error('Failed to delete account');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsRemovingAccount(false); // Set loading state back to false
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-20 z-50">
      <div className="w-[95vw] max-w-lg p-6 bg-white shadow-lg rounded-xl relative">
        {/* Close button positioned absolutely */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-sm text-white bg-gray-400 hover:bg-gray-600 p-[.5px] rounded-full hover:scale-[1.01] hover:cursor-pointer "
        >
          <IoIosCloseCircleOutline size={24} />
        </button>

        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Remove Bank Account
        </h3>

        <label className="text-gray-600 text-sm tracking-tighter">
          Enter exact case sensitive bank account name to remove. <br />
          <input
            type="text"
            value={selectedBankAccountName}
            onChange={handleChange}
            className="p-2 border rounded-md text-gray-700 focus:border-black focus:border-2 focus:outline-none focus:ring-0"
          />
        </label>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleRemove}
            disabled={isRemovingAccount || !isRemoveEnabled}
            className={`${
              isRemoveEnabled
                ? 'bg-red-700 hover:scale-[1.01]'
                : 'bg-gray-300 hover:cursor-not-allowed'
            } text-white p-2 py-1 rounded-md mt-4 hover:cursor-pointer`}
          >
            {isRemovingAccount ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveBankAccountForm;
