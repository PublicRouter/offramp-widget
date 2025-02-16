'use client';

import { useState, useEffect } from 'react';
import { useApi } from '../../../context/ApiContext'; // Import the useApi hook
import { useGlobalContext } from '../../../context/GlobalContext'; // Import the global context hook

type FormData = {
  country: string;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  type: string;
  kyc_type: string;
  tax_id: string;
  phone_number: string;
  ip_address: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  id_document_country: string;
  id_document_type: string;
  id_document_front: File | null;
  id_document_back: File | null;
  proof_of_address_type: string;
  proof_of_address_document: File | null;
};

export default function CreateReceiver() {
  const { api, initialized } = useApi(); // Destructure both api and initialized from the context
  const { data, setData } = useGlobalContext(); // Access the global context
  const authdEmail = sessionStorage.getItem('authdEmail');

  const [formData, setFormData] = useState<FormData>({
    country: '',
    first_name: '',
    last_name: '',
    email: authdEmail ? authdEmail : '',
    date_of_birth: '',
    type: 'individual', // always individual for now - will update later
    kyc_type: '',
    tax_id: '',
    phone_number: '',
    ip_address: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    id_document_country: '',
    id_document_type: '',
    id_document_front: null,
    id_document_back: null,
    proof_of_address_type: '',
    proof_of_address_document: null
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Form field change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Update kyc_type based on selected country
      if (name === 'country') {
        updated.kyc_type =
          value === 'US'
            ? 'standard'
            : value === 'MX' || value === 'AR'
            ? 'light'
            : '';
      }

      return updated;
    });
  };

  // File input change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    // Check if files is not null and has at least one file
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  // Convert date_of_birth to ISO string for API request
  const convertToISO = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  // Validate required fields before submission
  const validateFields = () => {
    const basicFields: (keyof FormData)[] = [
      'first_name',
      'last_name',
      'email',
      'date_of_birth',
      'country'
    ];
    for (const field of basicFields) {
      if (!formData[field]) {
        return `Please fill out the ${field.replace('_', ' ')} field.`;
      }
    }

    // If country is US, check additional fields
    if (formData.country === 'US') {
      const usFields: (keyof FormData)[] = [
        'tax_id',
        'phone_number',
        'address',
        'city',
        'state',
        'zip',
        'id_document_type',
        'id_document_front',
        'id_document_back',
        'proof_of_address_type',
        'proof_of_address_document'
      ];
      for (const field of usFields) {
        if (!formData[field]) {
          return `Please fill out the ${field.replace(
            '_',
            ' '
          )} field (US-specific).`;
        }
      }
    }

    return null;
  };

  const fetchReceiver = async (authdEmail: string) => {
    setLoading(true); // Start loading
    try {
      const data = await api?.getReceiverByEmail(authdEmail);
      if (data) {
        // Store receiver in global context if found
        setData('receiver', data);
      }
    } catch (err) {
      //@ts-expect-error
      setError('Error fetching newly created receiver data');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validateFields();
    if (error) {
      setMessage(error);
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      date_of_birth: convertToISO(formData.date_of_birth)
    };

    try {
      const { data } = await api?.createReceiver(payload);
      console.log('created new receiver response: ', data);
      if (data && data.id && authdEmail) {
        setMessage(`Receiver created successfully! ID: ${data.id}`);
        await fetchReceiver(authdEmail);
      } else {
        setMessage('Error creating receiver.');
      }
    } catch (err) {
      //@ts-expect-error
      setMessage(`Request failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!initialized) {
    return <p>Initializing...</p>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-[94%] sm:max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-2">
        Create Receiver (KYC)
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-h-[380px] overflow-scroll"
      >
        <label className="block text-gray-700 font-medium">
          Country:
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="mt-1 w-full p-3 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Country</option>
            <option value="US">US</option>
            <option value="MX">Mexico</option>
            <option value="AR">Argentina</option>
          </select>
        </label>

        {formData.country && (
          <>
            {/* Basic Fields */}
            <div>
              <label className="block text-gray-700 font-medium">
                First Name:
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Last Name:
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
            {!authdEmail && (
              <div>
                <label className="block text-gray-700 font-medium">
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 w-full p-3 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium">
                Date of Birth:
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>

            {/* Additional Fields for US */}
            {formData.country === 'US' && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium">
                    Tax ID:
                    <input
                      type="text"
                      name="tax_id"
                      value={formData.tax_id}
                      onChange={handleChange}
                      className="mt-1 w-full p-3 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium">
                    Phone Number:
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="mt-1 w-full p-3 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium">
                    Address:
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="mt-1 w-full p-3 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium">
                    City:
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="mt-1 w-full p-3 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium">
                    State:
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="mt-1 w-full p-3 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium">
                    Zip:
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      className="mt-1 w-full p-3 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium">
                    ID Document Type:
                    <select
                      name="id_document_type"
                      value={formData.id_document_type}
                      onChange={handleChange}
                      className="mt-1 w-full p-3 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Document Type</option>
                      <option value="passport">Passport</option>
                      <option value="id_card">ID Card</option>
                      <option value="drivers_license">Driver's License</option>
                    </select>
                  </label>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium">
                    ID Document Front:
                    <input
                      type="file"
                      name="id_document_front"
                      onChange={handleFileChange}
                      className="mt-1 w-full p-3 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium">
                    ID Document Back:
                    <input
                      type="file"
                      name="id_document_back"
                      onChange={handleFileChange}
                      className="mt-1 w-full p-3 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium">
                    Proof of Address Type:
                    <select
                      name="proof_of_address_type"
                      value={formData.proof_of_address_type}
                      onChange={handleChange}
                      className="mt-1 w-full p-3 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Proof Type</option>
                      <option value="utility_bill">Utility Bill</option>
                      <option value="bank_statement">Bank Statement</option>
                    </select>
                  </label>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium">
                    Proof of Address Document:
                    <input
                      type="file"
                      name="proof_of_address_document"
                      onChange={handleFileChange}
                      className="mt-1 w-full p-3 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                className="mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Creating Receiver...' : 'Create Receiver'}
              </button>
            </div>
          </>
        )}
      </form>

      {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    </div>
  );
}
