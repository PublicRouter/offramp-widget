import React, { useState } from 'react';
import { useApi } from '../../context/ApiContext';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import Spinner from '../common/Spinner';
import { accountFieldsMapping } from '../../utils/accountFields';

interface AddBankAccountFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  receiverId: string;
}

const AddBankAccountForm: React.FC<AddBankAccountFormProps> = ({
  onSubmit,
  onCancel,
  receiverId
}) => {
  const { api } = useApi();
  const [bankAccountType, setBankAccountType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState<Record<string, string>>({
    name: '',
    type: '',
    account_number: '',
    account_type: '',
    account_class: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state_province_region: '',
    country: '',
    postal_code: '',
    bank_name: '',
    routing_number: '',
    beneficiary_name: '',
    pix_key: '',
    spei_protocol: '',
    spei_institution_code: '',
    spei_clabe: '',
    transfers_type: '',
    transfers_account: '',
    ach_cop_beneficiary_first_name: '',
    ach_cop_beneficiary_last_name: '',
    ach_cop_document_id: '',
    ach_cop_document_type: '',
    ach_cop_email: '',
    ach_cop_bank_code: '',
    ach_cop_bank_account: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setBankAccountType(type);

    setFormData((prev) => ({
      ...prev,
      type,
      name: '',
      account_number: '',
      account_type: '',
      account_class: '',
      country: '',
      spei_protocol: '',
      spei_institution_code: '',
      spei_clabe: '',
      transfers_type: '',
      transfers_account: '',
      ach_cop_beneficiary_first_name: '',
      ach_cop_beneficiary_last_name: '',
      ach_cop_document_id: '',
      ach_cop_document_type: '',
      ach_cop_email: '',
      ach_cop_bank_code: '',
      ach_cop_bank_account: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    setIsSubmitting(true);

    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(
        ([, value]) => value !== '' && value !== undefined
      )
    );

    try {
      const response = await api?.createBankAccount(receiverId, filteredData);
      if (response.error == null) {
        onSubmit(filteredData);
        onCancel(); // Close form after submission
      } else {
        console.error('Error adding bank account', response);
        if (response.error.message === 'kyc_type_not_supported') {
          setErrorMessage('Upgrade KYC to add this type of bank account.');
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
          {field.required ? (
            field.options ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
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
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="w-full p-2 py-[5px] my-1 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            )
          ) : field.options ? (
            <select
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
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
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full p-2 py-[5px] my-1 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
            />
          )}
        </label>
      </div>
    ));
  };

  const InputSection = () => {
    return (
      <div className="max-h-[300px] overflow-y-auto px-2">
        {renderFieldsForType()}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-20 z-50">
      <div className="w-[90vw] max-w-[400px] p-6 bg-white shadow-lg rounded-xl relative">
        {/* Close button positioned absolutely */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200"
        >
          <IoIosCloseCircleOutline size={24} />
        </button>

        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Add Bank Account
        </h3>

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
            <option value="spei_bitso">SPEI Bitso 🇨🇲 Mexico ~5 minutes</option>
            <option value="ach_cop_bitso">
              ACH COP Bitso 🇨🇴 Colombia ~1 business day
            </option>
            <option value="transfers_bitso">
              Transfers Bitso 🇦🇷 Argentina ~5 minutes
            </option>
          </select>
        </label>

        {InputSection()}

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
