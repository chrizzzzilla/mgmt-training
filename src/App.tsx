import React, { useState } from 'react';

function App() {
  const [isVibrating, setIsVibrating] = useState(false);

  const handleButtonClick = () => {
    setIsVibrating(true);
    
    // Reset vibration after 0.5 seconds
    setTimeout(() => {
      setIsVibrating(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <button
          onClick={handleButtonClick}
          className={`
            px-8 py-4 text-xl font-semibold rounded-lg transition-all duration-200
            bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl
            ${isVibrating ? 'animate-shake' : ''}
          `}
        >
          Klick mich!
        </button>
      </div>
    </div>
  );
}

export default App;
