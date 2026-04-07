import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useApi } from '../../context/ApiContext';
import { useGlobalContext } from '../../context/GlobalContext';
import Spinner from '../common/Spinner';
import { kycMappings } from '../../utils/kycMappings';

type CreateReceiverProps = {
  setRoute: (route: 'start' | 'existing' | 'create') => void;
};

const CreateReceiver = ({ setRoute }: CreateReceiverProps) => {
  const { api, initialized } = useApi();
  const { setReceiver } = useGlobalContext();
  const authdEmail = localStorage.getItem('authdEmail');

  const [selectedKycType, setSelectedKycType] = useState<'light' | 'standard' | 'enhanced'>('standard');
  const accountType = 'individual' as const;

  const [formData, setFormData] = useState<Record<string, string>>({
    email: authdEmail || '',
  });
  const [fileData, setFileData] = useState<Record<string, File>>({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const json = await res.json();
        setFormData((prev) => ({ ...prev, ip_address: json.ip }));
      } catch (err) {
        console.error('Error fetching IP address:', err);
      }
    };
    fetchIP();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'country') {
      if (value === 'US') {
        setSelectedKycType('standard');
      } else if (value === 'MX' || value === 'AR' || value === 'BR') {
        setSelectedKycType('light');
      } else {
        setSelectedKycType('standard');
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files?.[0]) {
      setFileData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fields = kycMappings[selectedKycType][accountType];
    for (const field of fields) {
      if (field.required && !formData[field.name] && !fileData[field.name]) {
        setMessage(`Please fill out ${field.label}`);
        return;
      }
    }
    setLoading(true);

    try {
      const payload: Record<string, unknown> = { ...formData, ...fileData };
      if (typeof payload.date_of_birth === 'string') {
        payload.date_of_birth = new Date(payload.date_of_birth as string).toISOString();
      }

      const response = await api?.createReceiver(payload as Record<string, unknown>);
      const receiver = response?.data;
      if (receiver?.id && authdEmail) {
        setReceiver(receiver);
        setRoute('existing');
      } else {
        setMessage(response?.error?.message || 'Error creating receiver. Try again.');
      }
    } catch {
      setMessage('Error creating receiver. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!initialized) {
    return <p>Initializing...</p>;
  }

  const fieldsToRender = formData.country
    ? kycMappings[selectedKycType][accountType]
    : [];

  return (
    <div className="page border border-gray-300 p-8 rounded-lg shadow-md w-full mx-auto text-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-2">
        Create Receiver (KYC)
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          </select>
        </div>

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
