// /src/components/index.tsx

import React, { useEffect, useState, useRef } from 'react';
import { useApi } from '../context/ApiContext';
import { useGlobalContext } from '../context/GlobalContext';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import Spinner from './common/Spinner';

// PAGES
import { CreateReceiver, ReceiverDashboard, StartButton } from './pages';

const Widget = () => {
  const { api, initialized } = useApi();
  const { data, setData } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [route, setRoute] = useState<'start' | 'existing' | 'create'>('start');
  const fetchCalled = useRef(false); // Track if fetchReceiver has been called

  const closeWidget = () => {
    setRoute('start');
  };

  const wrapPageInClose = (component: React.ReactNode) => {
    return (
      <div className="flex flex-col items-end w-[95vw] max-w-[400px]">
        <button
          onClick={closeWidget}
          className="text-gray-600 hover:text-black p-[.5px] rounded-full text-sm hover:cursor-pointer relative top-10 right-3 hover:scale-[1.01]"
        >
          <IoIosCloseCircleOutline size={24} />
        </button>
        {component}
      </div>
    );
  };


  useEffect(() => {
    if (!initialized || fetchCalled.current) return; // Avoid running if already initialized or if fetch is called

    const authdEmail = localStorage.getItem('authdEmail');

    if (!authdEmail || data.receiver) {
      return; // If no `authdEmail` is found or receiver data exists, skip fetching
    }

    const fetchReceiver = async () => {
      setLoading(true); // Start loading
      try {
        const data = await api?.getReceiverByEmail(authdEmail); // Call the API function to fetch the receiver
        if (data) {
          // Store receiver in global context if found
          setData('receiver', data);
        }
      } catch (err) {
        setError('Error fetching receiver data');
      } finally {
        setLoading(false);
      }
    };

    fetchReceiver(); // Fetch receiver when the component mounts
    fetchCalled.current = true; // Ensure fetchReceiver is not called again
  }, [api, initialized, setData, data.receiver]);

  // onClick handler to check if receiver exists in global context and navigate accordingly
  const handleStartClick = () => {
    if (data.receiver) {
      setRoute('existing'); // Navigate to existing receiver page if receiver exists
    } else {
      setRoute('create'); // Navigate to create page if no receiver exists
    }
  };

  // Centralized page mapping
  const pages: Record<'start' | 'existing' | 'create', React.ReactNode> = {
    start: <StartButton onClick={handleStartClick} loading={loading} />,
    existing: wrapPageInClose(<ReceiverDashboard />),
    create: wrapPageInClose(<CreateReceiver setRoute={setRoute} />)
  };

  if (!initialized) {
      return (
          <div className='flex justify-center items-center'>
            <Spinner />
            Initializing...
          </div>
      );
  }

  return (
    <div className="offramp-widget root">
      {pages[route]} {/* Render the component based on the current route */}
    </div>
  );
}

export { Widget };
