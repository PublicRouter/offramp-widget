import React, { useState } from 'react';
import { useApi } from '../../context/ApiContext';
import { IoIosCloseCircleOutline } from 'react-icons/io';

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
  const [formData, setFormData] = useState({
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
    setIsSubmitting(true);

    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(
        ([key, value]) => value !== '' && value !== undefined
      )
    );

    try {
      const response = await api?.createBankAccount(receiverId, filteredData);
      if (response.error == null) {
        onSubmit(filteredData);
        onCancel(); // Close form after submission
      } else {
        console.error('Error adding bank account', response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Conditional rendering based on bank account type
  const renderFieldsForType = () => {
    switch (bankAccountType) {
      case 'pix':
        return (
          <>
            <label className="text-gray-600">
              Bank Account Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
            <label className="text-gray-600">
              Pix Key
              <input
                type="text"
                name="pix_key"
                value={formData.pix_key}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
          </>
        );
      case 'ach':
        return (
          <>
            <label className="text-gray-600">
              Bank Account Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
            <label className="text-gray-600">
              Beneficiary Full Name
              <input
                type="text"
                name="beneficiary_name"
                value={formData.beneficiary_name}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
            <label className="text-gray-600">
              Routing Number
              <input
                type="text"
                name="routing_number"
                value={formData.routing_number}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
            <label className="text-gray-600">
              Account Number
              <input
                type="text"
                name="account_number"
                value={formData.account_number}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
            <label className="text-gray-600">
              Account Type
              <select
                name="account_type"
                value={formData.account_type}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="">Select Account Type</option>
                <option value="checking">Checking</option>
                <option value="saving">Saving</option>
              </select>
            </label>
            <label className="text-gray-600">
              Account Class
              <select
                name="account_class"
                value={formData.account_class}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="">Select Account Class</option>
                <option value="individual">Individual</option>
                <option value="business">Business</option>
              </select>
            </label>
          </>
        );
      case 'wire':
        return (
          <>
            <label className="text-gray-600">
              Bank Account Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
            {/* Additional fields for 'wire' account type */}
            <label className="text-gray-600">
              Beneficiary Name
              <input
                type="text"
                name="beneficiary_name"
                value={formData.beneficiary_name}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
            <label className="text-gray-600">
              Routing Number
              <input
                type="text"
                name="routing_number"
                value={formData.routing_number}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
            <label className="text-gray-600">
              Account Number
              <input
                type="text"
                name="account_number"
                value={formData.account_number}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
            <label className="text-gray-600">
              Address Line 1
              <input
                type="text"
                name="address_line_1"
                value={formData.address_line_1}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
            <label className="text-gray-600">
              City
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
            <label className="text-gray-600">
              State / Province / Region
              <input
                type="text"
                name="state_province_region"
                value={formData.state_province_region}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
            <label className="text-gray-600">
              Country
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
            <label className="text-gray-600">
              Postal/Zip Code
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>

            {/* Add more fields as needed */}
          </>
        );
      case 'transfers_bitso':
        return (
          <>
            <label className="text-gray-600">
              Bank Account Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
            <label className="text-gray-600">
              Beneficiary Name
              <input
                type="text"
                name="beneficiary_name"
                value={formData.beneficiary_name}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
            <label className="text-gray-600">
              Transfers Type
              <select
                name="transfers_type"
                value={formData.transfers_type}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="">Select Transfer Type</option>
                <option value="CVU">CVU</option>
                <option value="CBU">CBU</option>
                <option value="ALIAS">ALIAS</option>
              </select>
            </label>
            <label className="text-gray-600">
              Transfers Account
              <input
                type="text"
                name="transfers_account"
                value={formData.transfers_account}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
          </>
        );
      case 'spei_bitso':
        return (
          <>
            <label className="text-gray-600">
              Bank Account Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
            <label className="text-gray-600">
              Beneficiary Name
              <input
                type="text"
                name="beneficiary_name"
                value={formData.beneficiary_name}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
            <label className="text-gray-600">
              SPEI Protocol
              <input
                type="text"
                name="spei_protocol"
                value={formData.spei_protocol}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
            <label className="text-gray-600">
              SPEI Institution Code
              <input
                type="text"
                name="spei_institution_code"
                value={formData.spei_institution_code}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
            <label className="text-gray-600">
              SPEI CLABE
              <input
                type="text"
                name="spei_clabe"
                value={formData.spei_clabe}
                onChange={handleChange}
                className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </label>
          </>
        );
      default:
        return null;
    }
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
      <div className="w-[90vw] max-w-lg p-6 bg-white shadow-lg rounded-xl relative">
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

        <label className="text-gray-600 block">
          Bank Account Type
          <select
            name="type"
            value={bankAccountType}
            onChange={handleSelectType}
            className="w-full p-2 py-1 mt-1 mb-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
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

        <div className="flex justify-between mt-6">
          <button
            onClick={handleSubmit}
            className="bg-gray-700 text-white p-2 rounded-md w-full hover:scale-[1.01] hover:bg-black"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBankAccountForm;
