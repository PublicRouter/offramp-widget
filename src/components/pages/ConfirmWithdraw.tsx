import React, { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { encodeFunctionData } from 'viem';

interface QuoteNetwork {
  chainId: number;
  name: string;
}

interface QuoteContract {
  address: `0x${string}`;
  abi: object[];
  functionName: string;
  blindpayContractAddress: `0x${string}`;
  amount: string;
  network: QuoteNetwork;
}

export interface QuoteResponseData {
  id: string;
  expires_at: number;
  commercial_quotation: number;
  blindpay_quotation: number;
  sender_amount: number;
  partner_fee_amount: number;
  receiver_amount: number;
  flat_fee: number;
  contract: QuoteContract;
}

export interface QuoteResponse {
  data: QuoteResponseData;
  error: unknown;
}

interface ConfirmWithdrawalProps {
  quote: QuoteResponse;
  onComplete: () => void;
}

const ConfirmWithdrawal: React.FC<ConfirmWithdrawalProps> = ({
  quote,
  onComplete
}) => {
  const { data } = useGlobalContext();
  const privySmartClient = data.privySmartClient;

  const [txHash, setTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use viem to encode the function data for "approve"
      const callData = encodeFunctionData({
        abi: quote.data.contract.abi,
        functionName: 'approve',
        args: [
          quote.data.contract.blindpayContractAddress,
          BigInt(quote.data.contract.amount)
        ]
      });

      // Create the call object for batching
      const call = {
        to: quote.data.contract.address,
        data: callData,
        value: 0n // No Ether is sent with this transaction
      };

      const uiOptions = {
        title: 'Approve Tokens',
        description: 'Approve tokens to be spent by BlindPay.',
        buttonText: 'Approve'
      };

      // Send a batched transaction with a single call
      const result = await privySmartClient.sendTransaction(
        { calls: [call] },
        { uiOptions }
      );
      setTxHash(result);
    } catch (err: any) {
      console.error('Approval error:', err);
      setError(err.message || 'There was an issue preparing your transaction');
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
