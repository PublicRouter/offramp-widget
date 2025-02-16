import React from 'react';

interface StartProps {
  onClick: () => void; // Define the onClick prop type
  loading: boolean;
}

const Start: React.FC<StartProps> = ({ onClick, loading }) => {
  return (
    <div>
      <button
        className="bg-background text-foreground rounded-md border border-foreground py-2 px-4 hover:scale-[1.02] hover:cursor-pointer"
        onClick={onClick} // Attach the onClick handler
        disabled={loading} // Disable the button when loading is true
      >
        {loading ? 'Initializing...' : 'Bank Account'}{' '}
        {/* Show 'Initializing...' when loading is true */}
      </button>
    </div>
  );
};

export default Start;
