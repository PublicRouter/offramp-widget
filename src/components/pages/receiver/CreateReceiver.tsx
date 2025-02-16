'use client';

import { useState, useEffect } from 'react';
import { useApi } from '../../../context/ApiContext'; // Import the useApi hook
import { useGlobalContext } from '../../../context/GlobalContext'; // Import the global context hook
import Spinner from '../../common/Spinner';

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

type CreateReceiverProps = {
  setRoute: (route: 'start' | 'existing' | 'create') => void;
};

export default function CreateReceiver({ setRoute }: CreateReceiverProps) {
  const { api, initialized } = useApi();
  const { data, setData } = useGlobalContext();
  const authdEmail = sessionStorage.getItem('authdEmail');

  const [formData, setFormData] = useState<FormData>({
    country: '',
    first_name: '',
    last_name: '',
    email: authdEmail ? authdEmail : '',
    date_of_birth: '',
    type: 'individual',
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
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const convertToISO = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

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
    setLoading(true);
    try {
      const data = await api?.getReceiverByEmail(authdEmail);
      if (data) {
        setData('receiver', data);
      }
    } catch (err) {
      //@ts-expect-error
      setError('Error fetching newly created receiver data');
    } finally {
      setLoading(false);
    }
  };

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
        await fetchReceiver(authdEmail);
        setRoute('existing');
      } else {
        setMessage('Error creating receiver. Try Again.');
      }
    } catch (err) {
      setMessage(`Error creating receiver. Try Again.`);
    } finally {
      setLoading(false);
    }
  };

  if (!initialized) {
    return <p>Initializing...</p>;
  }

  return (
    <div className="page border border-gray-300 p-8 rounded-lg shadow-md w-full mx-auto text-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-2">
        Create Receiver (KYC)
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-gray-700 font-medium px-2">
          Country:
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="mt-1 w-full mx-auto p-2 py-[5px] bg-gray-100 rounded-md border border-gray-300 text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="">Select Country</option>
            <option value="US">US</option>
            <option value="MX">Mexico</option>
            <option value="AR">Argentina</option>
          </select>
        </label>

        <hr className="my-[10px]" />

        <div className="overflow-y-auto max-h-[300px] px-2 py-2">
          {formData.country && (
            <>
              <div>
                <label className="block text-gray-700 font-medium">
                  First Name:
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="mt-1 mb-1 w-full p-2 py-[5px] bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
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
                    className="mt-1 mb-1 w-full p-2 py-[5px] bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
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
                      className="mt-1 mb-1 w-full p-2 py-[5px] bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
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
                    className="mt-1 mb-1 w-full p-2 py-[5px] bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
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
                        className="mt-1 mb-1 w-full p-2 py-[5px] bg-gray-100 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </label>
                  </div>
                  {/* Other fields */}
                </>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="mt-3 text-md hover:cursor-pointer px-5 py-2 bg-gray-800 text-white font-semibold rounded-md hover:scale-[1.02]"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <Spinner />
                <p>Generating...</p>
              </div>
            ) : (
              'Create Receiver'
            )}
          </button>
        </div>
      </form>

      {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    </div>
  );
}
