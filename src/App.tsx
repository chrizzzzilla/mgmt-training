import React, { useState } from 'react';

function App() {
  const [isClicked, setIsClicked] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleButtonClick = () => {
    setIsClicked(true);
    setClickCount(prev => prev + 1);
    
    // Reset visual signal after 2 seconds
    setTimeout(() => {
      setIsClicked(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Einfache Button-Seite
        </h1>
        
        <div className="relative">
          <button
            onClick={handleButtonClick}
            className={`
              px-8 py-4 text-xl font-semibold rounded-lg transition-all duration-300 transform
              ${isClicked 
                ? 'bg-green-500 text-white scale-110 shadow-2xl' 
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-lg'
              }
            `}
          >
            {isClicked ? '✅ Geklickt!' : 'Klick mich!'}
          </button>
          
          {/* Visual feedback ring */}
          {isClicked && (
            <div className="absolute inset-0 rounded-lg bg-green-400 animate-ping opacity-75"></div>
          )}
        </div>
        
        <div className="mt-8">
          <p className="text-lg text-gray-600 mb-2">
            Anzahl der Klicks: 
          </p>
          <div className="text-3xl font-bold text-blue-600">
            {clickCount}
          </div>
        </div>
        
        {isClicked && (
          <div className="mt-6 animate-bounce">
            <div className="text-2xl">🎉</div>
            <p className="text-green-600 font-semibold">Button wurde geklickt!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
