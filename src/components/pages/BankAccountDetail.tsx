import React, { useEffect, useState } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import Spinner from '../common/Spinner';
import { accountFieldsMapping } from '../../utils/accountFields';
import { useApi } from '../../context/ApiContext';
import { getBankAccountDetails } from '../../utils/bankAccountMapping';
import ConfirmWithdrawal from './ConfirmWithdraw';

interface BankAccountDetailProps {
  bankAccount: any;
  totalAmount: string | number;
  onClose: () => void; // Called to return to the dashboard
}

const BankAccountDetail: React.FC<BankAccountDetailProps> = ({
  bankAccount,
  totalAmount,
  onClose
}) => {
  const { api } = useApi();
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<any>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  // New state to control the ConfirmWithdrawal overlay
  const [showConfirmOverlay, setShowConfirmOverlay] = useState(false);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const amountAsNumber =
          typeof totalAmount === 'string'
            ? parseFloat(totalAmount)
            : totalAmount;

        if (isNaN(amountAsNumber)) {
          throw new Error('Invalid amount value');
        }

        const formattedAmount = Math.round(amountAsNumber * 100);
        const quoteData = await api?.getQuote(bankAccount.id, formattedAmount);

        if (quoteData?.error?.message) {
          setQuoteError(quoteData.error.message);
        } else {
          setQuote(quoteData.data);
          setQuoteError(null);

          if (
            quoteData?.data?.sender_amount &&
            quoteData?.data?.receiver_amount
          ) {
            const rate =
              quoteData.data.receiver_amount / quoteData.data.sender_amount;
            setExchangeRate(rate);
          }
        }
      } catch (error) {
        console.error('Error fetching quote:', error);
      } finally {
        setQuoteLoading(false);
        setLoading(false);
      }
    };

    fetchQuote();
  }, [bankAccount, totalAmount, api]);

  const renderAccountFields = () => {
    const fields = accountFieldsMapping[bankAccount.type] || [];

    return fields.map((field, index) => (
      <div key={field.name} className="flex">
        {index === 0 ? (
          <div>
            <h4 className="text-lg font-semibold text-gray-700 border-b-1 mb-1">
              {bankAccount[field.name] || 'N/A'}
            </h4>
            <p className="text-gray-500 text-md">
              Type:{' '}
              <span className="text-gray-700 font-semibold">
                {bankAccount.type}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-gray-500 text-md">
            {field.label}:{' '}
            <span className="text-gray-700 font-semibold">
              {bankAccount[field.name] || 'N/A'}
            </span>
          </p>
        )}
      </div>
    ));
  };

  const { country, currency, flag } = getBankAccountDetails(bankAccount.type);

  // Callback for when ConfirmWithdrawal finishes (either success or failure)
  const handleConfirmComplete = () => {
    // Close both overlays, and route back to the ReceiverDashboard.
    setShowConfirmOverlay(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-20 z-50 text-gray-700">
      <div className="w-[95vw] max-w-[400px] p-6 bg-white shadow-lg rounded-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black p-1 rounded-full"
        >
          <IoIosCloseCircleOutline size={24} />
        </button>

        <h3 className="text-xl font-thin text-gray-700 mb-4">
          Bank Account Details
        </h3>

        <div className="mb-4">{renderAccountFields()}</div>

        <div className="mt-4">
          <h2>Withdraw Amount: </h2>
          <p className="text-xl">${totalAmount}</p>
        </div>

        {quoteLoading ? (
          <div className="flex justify-center items-center mt-4">
            <Spinner />
            Loading Quote...
          </div>
        ) : (
          quote && (
            <div>
              <h4 className="text-md font-semibold mt-4">
                Rate you will receive:
              </h4>
              <p className="text-xl font-bold">
                $
                {quote.receiver_amount
                  ? (quote.receiver_amount / 100).toFixed(2)
                  : 'N/A'}{' '}
                {flag}
              </p>
              <p className="text-gray-500">
                Rate: {exchangeRate ? exchangeRate.toFixed(3) : 'N/A'}{' '}
                {currency}
              </p>
            </div>
          )
        )}

        {quoteError && (
          <div className="mt-4 text-red-600">
            <p>{quoteError}</p>
          </div>
        )}

        <button
          onClick={() => setShowConfirmOverlay(true)}
          className="px-3 py-2 rounded-md bg-gray-800 hover:scale-[1.01] text-white mt-5"
        >
          Proceed To Confirmation
        </button>

        {/* Overlay the ConfirmWithdrawal component when requested */}
        {showConfirmOverlay && quote && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-60">
            <ConfirmWithdrawal
              quote={{ data: quote, error: null }}
              onComplete={handleConfirmComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BankAccountDetail;
