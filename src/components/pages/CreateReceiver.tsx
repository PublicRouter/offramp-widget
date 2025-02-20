import { useState, useEffect } from 'react';
import { useApi } from '../../context/ApiContext';
import { useGlobalContext } from '../../context/GlobalContext';
import Spinner from '../common/Spinner';
import { kycMappings } from '../../utils/kycMappings';

type CreateReceiverProps = {
  setRoute: (route: 'start' | 'existing' | 'create') => void;
};

const CreateReceiver = ({ setRoute }: CreateReceiverProps) => {
  const { api, initialized } = useApi();
  const { setData } = useGlobalContext();
  const authdEmail = sessionStorage.getItem('authdEmail');

  // Default to individual account.
  const [selectedKycType, setSelectedKycType] = useState<
    'light' | 'standard' | 'enhanced'
  >('standard');
  const [accountType, setAccountType] = useState<'individual' | 'business'>(
    'individual'
  );

  // Minimal form data; country must be selected.
  const [formData, setFormData] = useState<Record<string, any>>({
    email: authdEmail || ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Automatically fetch user's IP on mount.
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        setFormData((prev) => ({ ...prev, ip_address: data.ip }));
      } catch (err) {
        console.error('Error fetching IP address:', err);
      }
    };
    fetchIP();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // If country changes, force the correct KYC type per our rules.
    if (name === 'country') {
      if (value === 'US') {
        setSelectedKycType('standard');
        setAccountType('individual');
      } else if (value === 'MX' || value === 'AR' || value === 'BR') {
        setSelectedKycType('light');
        setAccountType('individual');
      } else {
        // For any other country, default to standard (or adjust as needed).
        setSelectedKycType('standard');
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all required fields based on our mapping.
    const fields = kycMappings[selectedKycType][accountType];
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        setMessage(`Please fill out ${field.label}`);
        return;
      }
    }
    setLoading(true);

    try {
      const payload = { ...formData };
      // Convert date fields if necessary.
      if (payload.date_of_birth) {
        payload.date_of_birth = new Date(payload.date_of_birth).toISOString();
      }
      console.log('Payload: ', payload);
      const { data } = await api?.createReceiver(payload);
      console.log('Receiver created:', data);
      if (data && data.id && authdEmail) {
        setData('receiver', data);
        setRoute('existing');
      } else {
        setMessage(data?.error?.message || 'Error creating receiver. Try again.');
      }
    } catch (err) {
      setMessage('Error creating receiver. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!initialized) {
    return <p>Initializing...</p>;
  }

  // Render additional fields only after a country is selected.
  const fieldsToRender = formData.country
    ? kycMappings[selectedKycType][accountType]
    : [];

  return (
    <div className="page border border-gray-300 p-8 rounded-lg shadow-md w-full mx-auto text-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-2">
        Create Receiver (KYC)
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Always show the country dropdown */}
        <div>
          <label className="block text-gray-700 font-medium">Country:</label>
          <select
            name="country"
            onChange={handleChange}
            value={formData.country || ''}
            className="mt-1 w-full p-2 border rounded"
            required
          >
            <option value="">Select Country</option>
            <option value="US">US</option>
            <option value="MX">Mexico</option>
            <option value="AR">Argentina</option>
            <option value="BR">Brazil</option>
            {/* Extend with additional country codes as needed */}
          </select>
        </div>

        {/* Once a country is selected, render the rest of the fields */}
        {formData.country && (
          <>
            <hr className="my-4" />
            <div className="overflow-y-auto max-h-[300px] px-2 py-2">
              {fieldsToRender.map((field) => (
                <div key={field.name} className="mb-3">
                  <label className="block text-gray-700 font-medium">
                    {field.label}:{field.required ? ' *' : ''}
                  </label>
                  {field.type === 'select' && field.options ? (
                    <select
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border rounded"
                      required={field.required}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'file' ? (
                    <input
                      type="file"
                      name={field.name}
                      onChange={handleFileChange}
                      className="mt-1 w-full p-2 border rounded"
                      required={field.required}
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border rounded"
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !formData.country}
            className="mt-3 px-5 py-2 bg-gray-800 text-white font-semibold rounded-md hover:scale-[1.02]"
          >
            {loading ? (
              <div className="flex items-center">
                <Spinner />
                <p>Creating...</p>
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
};

export default CreateReceiver;
