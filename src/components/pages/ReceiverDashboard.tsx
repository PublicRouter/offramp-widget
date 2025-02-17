import { useState, useEffect } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { useApi } from '../../context/ApiContext';
import BankAccountView from '../BankAccountView';
import AddBankAccountForm from './AddBankAccountForm';
import RemoveBankAccountForm from './RemoveBankAccountForm';
import BankAccountDetail from './BankAccountDetail';
import Spinner from '../common/Spinner';

const ReceiverDashboard = () => {
  const { data } = useGlobalContext();
  const { api } = useApi();
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState<any | null>(
    null
  );
  const [totalAmount, setTotalAmount] = useState<number>(0);

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
    setSelectedBankAccount(null); // Reset the selected bank account
  };

  const handleBankAccountClick = (bankAccount: any) => {
    setSelectedBankAccount(bankAccount);

    setTotalAmount(500); // !! hardcoded example (temporary)
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
        <div className="text-center text-gray-500">
          <div className="flex justify-center items-center">
            <Spinner />
            Loading...
          </div>
        </div>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      <BankAccountView
        loading={loading}
        bankAccounts={bankAccounts}
        onAddClick={handleAddButtonClick}
        onRemoveClick={handleRemoveButtonClick}
        onBankAccountClick={handleBankAccountClick}
      />

      {/* Conditional rendering of forms and details */}
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

      {selectedBankAccount && (
        <BankAccountDetail
          bankAccount={selectedBankAccount}
          totalAmount={totalAmount}
          onClose={handleCancel}
        />
      )}
    </div>
  );
};

export default ReceiverDashboard;
