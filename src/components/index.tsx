import { useEffect, useState, useRef, type ReactNode } from 'react';
import { useApi } from '../context/ApiContext';
import { useGlobalContext } from '../context/GlobalContext';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import Spinner from './common/Spinner';
import { CreateReceiver, ReceiverDashboard, StartButton } from './pages';

const Widget = () => {
  const { api, initialized } = useApi();
  const { state, setReceiver } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState<'start' | 'existing' | 'create'>('start');
  const fetchCalled = useRef(false);

  const closeWidget = () => {
    setRoute('start');
  };

  const wrapPageInClose = (component: ReactNode) => (
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

  useEffect(() => {
    if (!initialized || fetchCalled.current) return;

    const authdEmail = localStorage.getItem('authdEmail');
    if (!authdEmail || state.receiver) return;

    const fetchReceiver = async () => {
      setLoading(true);
      try {
        const receiver = await api?.getReceiverByEmail(authdEmail);
        if (receiver) {
          setReceiver(receiver);
        }
      } catch {
        // Receiver not found or network error — user will see the create flow
      } finally {
        setLoading(false);
      }
    };

    fetchReceiver();
    fetchCalled.current = true;
  }, [api, initialized, setReceiver, state.receiver]);

  const handleStartClick = () => {
    if (state.receiver) {
      setRoute('existing');
    } else {
      setRoute('create');
    }
  };

  const pages: Record<typeof route, ReactNode> = {
    start: <StartButton onClick={handleStartClick} loading={loading} />,
    existing: wrapPageInClose(<ReceiverDashboard />),
    create: wrapPageInClose(<CreateReceiver setRoute={setRoute} />),
  };

  if (!initialized) {
    return (
      <div className="flex justify-center items-center">
        <Spinner />
        Initializing...
      </div>
    );
  }

  return (
    <div className="offramp-widget root">
      {pages[route]}
    </div>
  );
};

export { Widget };
