import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../../context/GlobalContext';
import { useApi } from '../../../context/ApiContext';
import Display from '../../bankAccount/Display';
import AddBankAccountForm from '../../bankAccount/AddBankAccountForm';
import RemoveBankAccountForm from '../../bankAccount/RemoveBankAccountForm';

export default function ExistingReceiver() {
  const { data } = useGlobalContext();
  const { api } = useApi();
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const fetchBankAccounts = async () => {
    setLoading(true);
    try {
      const bankAccountsResponse = await api?.getBankAccounts(data.receiver.id);
      const bankAccounts = bankAccountsResponse.data;
      setBankAccounts(bankAccounts);
    } catch (err) {
      setError('Error fetching bank accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!data.receiver) return;
    fetchBankAccounts();
  }, [api, data.receiver]);

  const handleAddButtonClick = () => {
    setIsAdding(true);
    setIsRemoving(false);
  };

  const handleRemoveButtonClick = () => {
    setIsRemoving(true);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsRemoving(false);
  };

  return (
    <div className="p-6 w-full mx-auto bg-white shadow-lg rounded-xl">
      <header className="text-center  mb-4 mt-2">
        <p className="text-gray-600">Welcome back,</p>
        <p className="text-3xl font-semibold text-gray-800">
          {data.receiver.first_name} {data.receiver.last_name}
        </p>
      </header>
      <h3 className="text-xl text-center text-gray-600 mb-3">
        Your Bank Accounts
      </h3>

      {loading && (
        <p className="text-center text-gray-500">Loading bank accounts...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      <Display
        loading={loading}
        bankAccounts={bankAccounts}
        onAddClick={handleAddButtonClick}
        onRemoveClick={handleRemoveButtonClick}
      />

      {/* Conditional rendering of forms */}
      {isAdding && (
        <AddBankAccountForm
          receiverId={data.receiver.id}
          onSubmit={fetchBankAccounts}
          onCancel={handleCancel}
        />
      )}
      {isRemoving && (
        <RemoveBankAccountForm
          receiverId={data.receiver.id}
          bankAccounts={bankAccounts}
          onSubmit={fetchBankAccounts}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
