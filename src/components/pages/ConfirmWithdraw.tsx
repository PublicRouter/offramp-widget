import { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { encodeFunctionData } from 'viem';
import type { Quote, ApiResponse } from '../../types';

interface ConfirmWithdrawalProps {
  quote: ApiResponse<Quote>;
  onComplete: () => void;
}

const ConfirmWithdrawal = ({ quote, onComplete }: ConfirmWithdrawalProps) => {
  const { state } = useGlobalContext();
  const privySmartClient = state.privySmartClient;

  const [txHash, setTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    if (!privySmartClient) {
      setError('Smart wallet client not available');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const callData = encodeFunctionData({
        abi: quote.data.contract.abi,
        functionName: 'approve',
        args: [
          quote.data.contract.blindpayContractAddress,
          BigInt(quote.data.contract.amount),
        ],
      });

      const result = await privySmartClient.sendTransaction(
        {
          calls: [{
            to: quote.data.contract.address,
            data: callData,
            value: 0n,
          }],
        },
        {
          uiOptions: {
            title: 'Approve Tokens',
            description: 'Approve tokens to be spent by BlindPay.',
            buttonText: 'Approve',
          },
        }
      );
      setTxHash(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'There was an issue preparing your transaction';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Confirm Withdrawal</h2>
      <p className="mb-2">Quote ID: {quote.data.id}</p>
      <button
        onClick={handleApprove}
        disabled={loading}
        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
      >
        {loading ? 'Approving...' : 'Confirm Withdrawal'}
      </button>
      {txHash && (
        <p className="mt-4">
          Transaction Hash:{' '}
          <a
            className="text-blue-600 underline"
            href={`https://base-sepolia.blockscout.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {txHash}
          </a>
        </p>
      )}
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
      <button
        onClick={onComplete}
        className="mt-6 px-3 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
      >
        Close
      </button>
    </div>
  );
};

export default ConfirmWithdrawal;
