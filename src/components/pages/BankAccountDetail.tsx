import React, { useEffect, useState } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import Spinner from '../common/Spinner'; // Assuming you have a spinner component for loading state
import { accountFieldsMapping } from '../../utils/accountFields'; // Import account fields mapping
import { useApi } from '../../context/ApiContext';
import { getBankAccountDetails } from '../../utils/bankAccountMapping'; // Import bank account type mapping

interface BankAccountDetailProps {
  bankAccount: any; // The detailed bank account data
  totalAmount: string | number; // The total amount being deposited for this account (string or number)
  onClose: () => void; // Function to close the detailed view and return to the dashboard
}

const BankAccountDetail: React.FC<BankAccountDetailProps> = ({
  bankAccount,
  totalAmount,
  onClose
}) => {
  const { api } = useApi();
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<any>(null); // State to store the quote result
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState<string | null>(null); // Error message state
  const [exchangeRate, setExchangeRate] = useState<number | null>(null); // State to store the exchange rate

  useEffect(() => {
    // Fetch the quote for the given bank account and total amount
    const fetchQuote = async () => {
      try {
        // Convert totalAmount to a number (if it's a string, parse it)
        const amountAsNumber =
          typeof totalAmount === 'string'
            ? parseFloat(totalAmount)
            : totalAmount;

        // Check if the parsed amount is valid (not NaN)
        if (isNaN(amountAsNumber)) {
          throw new Error('Invalid amount value');
        }

        // Convert the amount to the required format (integer) by multiplying by 100
        const formattedAmount = Math.round(amountAsNumber * 100); // Convert decimal to integer (e.g., 20.50 => 2050)

        // Fetch the quote
        const quoteData = await api?.getQuote(bankAccount.id, formattedAmount);

        // Check for error message in the response and set it to quoteError if found
        if (quoteData?.error?.message) {
          setQuoteError(quoteData?.error?.message); // Display the error message from API
        } else {
          // If no error message, set the quote data
          setQuote(quoteData.data);
          setQuoteError(null); // Clear any previous error

          // Calculate the exchange rate based on sender and receiver amounts
          if (
            quoteData?.data?.sender_amount &&
            quoteData?.data?.receiver_amount
          ) {
            const rate =
              quoteData?.data?.receiver_amount / quoteData?.data?.sender_amount;
            setExchangeRate(rate);
          }
        }
      } catch (error) {
        console.error('Error fetching quote:', error);
      } finally {
        setQuoteLoading(false); // Set loading to false after fetching the quote
        setLoading(false); // Set loading to false after the page is loaded
      }
    };

    fetchQuote(); // Call the fetch function on component load
  }, [bankAccount, totalAmount]); // Trigger fetch when bankAccount or totalAmount changes

  // Function to render fields based on bank account type using the accountFieldsMapping
  const renderAccountFields = () => {
    const fields = accountFieldsMapping[bankAccount.type] || [];

    return fields.map((field, index) => (
      <div key={field.name} className="flex">
        {/* If it's the first field (name), display it as the title */}
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

  // Get the bank account details (country, currency, flag)
  const { country, currency, flag } = getBankAccountDetails(bankAccount.type);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-20 z-50 text-gray-700">
      <div className="w-[95vw] max-w-[400px] p-6 bg-white shadow-lg rounded-xl relative">
        {/* Close button positioned absolutely */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black p-1 rounded-full"
        >
          <IoIosCloseCircleOutline size={24} />
        </button>

        <h3 className="text-xl font-thin text-gray-700 mb-4">
          Bank Account Details
        </h3>

        {/* Render the bank account details even while loading the quote */}
        <div className="mb-4">
          {renderAccountFields()} {/* Render fields dynamically */}
        </div>

        {/* Show the withdraw amount */}
        <div className="mt-4">
          <h2>Withdraw Amount: </h2>
          <p className="text-xl">${totalAmount}</p>
        </div>

        {/* Show loading spinner only for the quote section */}
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
                ${quote?.receiver_amount || 'N/A'} {flag}
              </p>
              <p className="text-gray-500">
                Rate: {exchangeRate ? exchangeRate.toFixed(4) : 'N/A'}{' '}
                {currency}
              </p>
            </div>
          )
        )}

        {/* Show error message below quote if any */}
        {quoteError && (
          <div className="mt-4 text-red-600">
            <p>{quoteError}</p>
          </div>
        )}

        <button className="px-3 py-2 rounded-md bg-gray-800 hover:scale-[1.01] text-white mt-5">
          Proceed To Confirmation
        </button>
      </div>
    </div>
  );
};

export default BankAccountDetail;
