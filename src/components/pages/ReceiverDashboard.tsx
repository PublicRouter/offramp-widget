import { useState, useEffect, useCallback } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { useApi } from '../../context/ApiContext';
import type { BankAccount } from '../../types';
import BankAccountView from '../BankAccountView';
import AddBankAccountForm from './AddBankAccountForm';
import RemoveBankAccountForm from './RemoveBankAccountForm';
import BankAccountDetail from './BankAccountDetail';
import Spinner from '../common/Spinner';

const ReceiverDashboard = () => {
  const { state } = useGlobalContext();
  const { api } = useApi();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');

  const fetchBankAccounts = useCallback(async () => {
    if (!state.receiver?.id) return;
    setLoading(true);
    try {
      const response = await api?.getBankAccounts(state.receiver.id);
      if (response?.data) {
        setBankAccounts(response.data);
      }
    } catch {
      setError('Error fetching bank accounts');
    } finally {
      setLoading(false);
    }
  }, [api, state.receiver?.id]);

  const fetchWalletBalance = useCallback(async (smartAddress: string) => {
    try {
      const response = await api?.getWalletBalance(smartAddress);
      if (response?.balance) {
        setWalletBalance(response.balance);
      }
    } catch (err) {
      console.error('Error fetching wallet balance:', err);
    }
  }, [api]);

  useEffect(() => {
    if (!state.receiver) return;
    fetchBankAccounts();
  }, [state.receiver, fetchBankAccounts]);

  useEffect(() => {
    const smartAddress = localStorage.getItem('smartAddress');
    if (smartAddress) {
      fetchWalletBalance(smartAddress);
    }
  }, [fetchWalletBalance]);

  const handleCancel = () => {
    setIsAdding(false);
    setIsRemoving(false);
    setSelectedBankAccount(null);
  };

  const handleBankAccountClick = (bankAccount: BankAccount) => {
    const amount = parseFloat(withdrawAmount);
    if (!withdrawAmount || isNaN(amount) || amount <= 0) {
      setError('Enter a valid withdrawal amount before selecting a bank account');
      return;
    }
    setError(null);
    setSelectedBankAccount(bankAccount);
  };

  if (!state.receiver) return null;

  return (
    <div className="p-6 w-full mx-auto bg-white shadow-lg rounded-xl">
      <header className="text-center mb-4 mt-2">
        <p className="text-gray-600">Welcome back,</p>
        <p className="text-3xl font-semibold text-gray-800">
          {state.receiver.first_name} {state.receiver.last_name}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Balance:</strong> {walletBalance}
        </p>
      </header>

      <div className="mb-4">
        <label className="block text-gray-600 text-sm mb-1">
          Withdrawal Amount (USD)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={withdrawAmount}
          onChange={(e) => {
            setWithdrawAmount(e.target.value);
            setError(null);
          }}
          placeholder="Enter amount"
          className="w-full p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

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
        onAddClick={() => { setIsAdding(true); setIsRemoving(false); }}
        onRemoveClick={() => { setIsRemoving(true); setIsAdding(false); }}
        onBankAccountClick={handleBankAccountClick}
      />

      {isAdding && (
        <AddBankAccountForm
          receiverId={state.receiver.id}
          onSubmit={fetchBankAccounts}
          onCancel={handleCancel}
        />
      )}
      {isRemoving && (
        <RemoveBankAccountForm
          receiverId={state.receiver.id}
          bankAccounts={bankAccounts}
          onSubmit={fetchBankAccounts}
          onCancel={handleCancel}
        />
      )}

      {selectedBankAccount && (
        <BankAccountDetail
          bankAccount={selectedBankAccount}
          totalAmount={parseFloat(withdrawAmount)}
          onClose={handleCancel}
        />
      )}
    </div>
  );
};

export default ReceiverDashboard;
