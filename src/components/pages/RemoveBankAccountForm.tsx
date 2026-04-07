import { useState, type ChangeEvent } from 'react';
import { useApi } from '../../context/ApiContext';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import Spinner from '../common/Spinner';
import type { BankAccount } from '../../types';

interface RemoveBankAccountFormProps {
  receiverId: string;
  bankAccounts: BankAccount[];
  onSubmit: () => void;
  onCancel: () => void;
}

const RemoveBankAccountForm = ({
  receiverId,
  bankAccounts,
  onSubmit,
  onCancel,
}: RemoveBankAccountFormProps) => {
  const [selectedBankAccountName, setSelectedBankAccountName] = useState('');
  const [isRemoveEnabled, setIsRemoveEnabled] = useState(false);
  const [isRemovingAccount, setIsRemovingAccount] = useState(false);
  const { api } = useApi();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setSelectedBankAccountName(name);
    setIsRemoveEnabled(bankAccounts.some((account) => account.name === name));
  };

  const handleRemove = async () => {
    if (!selectedBankAccountName) return;

    setIsRemovingAccount(true);
    const matchingAccount = bankAccounts.find(
      (account) => account.name === selectedBankAccountName
    );

    if (matchingAccount) {
      try {
        const response = await api?.deleteBankAccount(receiverId, matchingAccount.id);
        if (response?.error == null) {
          onSubmit();
          onCancel();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsRemovingAccount(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-20 z-50">
      <div className="w-[95vw] max-w-[400px] p-6 bg-white shadow-lg rounded-xl relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-sm text-gray-600 hover:text-black p-[.5px] rounded-full hover:scale-[1.01] hover:cursor-pointer"
        >
          <IoIosCloseCircleOutline size={24} />
        </button>

        <h3 className="text-xl font-semibold text-gray-700 mb-4">Remove Bank Account</h3>

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
            {isRemovingAccount ? (
              <div className="flex justify-center items-center">
                <Spinner />
                Removing...
              </div>
            ) : (
              'Remove'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveBankAccountForm;
