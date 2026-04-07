import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useApi } from '../../context/ApiContext';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import Spinner from '../common/Spinner';
import { accountFieldsMapping } from '../../utils/accountFields';

interface AddBankAccountFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  receiverId: string;
}

const AddBankAccountForm = ({ onSubmit, onCancel, receiverId }: AddBankAccountFormProps) => {
  const { api } = useApi();
  const [bankAccountType, setBankAccountType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectType = (e: ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setBankAccountType(type);
    setFormData({ type });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([, value]) => value !== '' && value !== undefined)
    );

    try {
      const response = await api?.createBankAccount(receiverId, filteredData);
      if (response?.error == null) {
        onSubmit();
        onCancel();
      } else {
        if (response.error.message === 'kyc_type_not_supported') {
          setErrorMessage('Upgrade KYC to add this type of bank account.');
        } else {
          setErrorMessage(response.error.message);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFieldsForType = () => {
    const fields = accountFieldsMapping[bankAccountType] || [];

    return fields.map((field) => (
      <div key={field.name} className="mb-3">
        <label className="text-gray-600">
          {field.label}
          {field.options ? (
            <select
              name={field.name}
              value={formData[field.name] ?? ''}
              onChange={handleChange}
              required={field.required}
              className="w-full p-2 py-[5px] my-1 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="">Select {field.label}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name={field.name}
              value={formData[field.name] ?? ''}
              onChange={handleChange}
              required={field.required}
              className="w-full p-2 py-[5px] my-1 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
            />
          )}
        </label>
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-20 z-50">
      <div className="w-[90vw] max-w-[400px] p-6 bg-white shadow-lg rounded-xl relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200"
        >
          <IoIosCloseCircleOutline size={24} />
        </button>

        <h3 className="text-xl font-semibold text-gray-700 mb-4">Add Bank Account</h3>

        <label className="text-gray-600 block px-2">
          Bank Account Type
          <select
            name="type"
            value={bankAccountType}
            onChange={handleSelectType}
            className="w-full p-2 py-[5px] my-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="">Select Account Type</option>
            <option value="pix">PIX 🇧🇷 Brazil ~5 minutes</option>
            <option value="ach">ACH 🇺🇸 United States ~2 business days</option>
            <option value="wire">Wire 🇺🇸 United States ~1 business day</option>
            <option value="spei_bitso">SPEI Bitso 🇲🇽 Mexico ~5 minutes</option>
            <option value="ach_cop_bitso">ACH COP Bitso 🇨🇴 Colombia ~1 business day</option>
            <option value="transfers_bitso">Transfers Bitso 🇦🇷 Argentina ~5 minutes</option>
          </select>
        </label>

        <div className="max-h-[300px] overflow-y-auto px-2">
          {renderFieldsForType()}
        </div>

        <div className="flex flex-col justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="bg-gray-900 text-white p-2 rounded-md w-full hover:scale-[1.01]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex justify-center items-center">
                <Spinner />
                Creating Account...
              </div>
            ) : (
              'Submit'
            )}
          </button>

          {errorMessage && (
            <p className="mt-4 text-center text-red-800 tracking-tighter">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBankAccountForm;
