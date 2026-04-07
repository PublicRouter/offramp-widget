import Spinner from '../common/Spinner';

interface StartButtonProps {
  onClick: () => void;
  loading: boolean;
}

const StartButton = ({ onClick, loading }: StartButtonProps) => {
  return (
    <div>
      <button
        className="bg-black/80 text-white shadow-md border-foreground rounded-md border py-2 px-4 hover:scale-[1.02] hover:cursor-pointer"
        onClick={onClick}
        disabled={loading}
      >
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner />
            Initializing...
          </div>
        ) : (
          'Withdraw To Bank'
        )}
      </button>
    </div>
  );
};

export default StartButton;
