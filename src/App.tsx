import React, { useState } from 'react';

function App() {
  const [isVibrating, setIsVibrating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = async () => {
    setIsVibrating(true);
    setIsLoading(true);
    
    try {
      // Call n8n webhook
      const response = await fetch('https://n8n.srv1071286.hstgr.cloud/webhook/7e5e35cc-ee63-46f6-b110-bbb7b55ebeae', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'button_clicked',
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('n8n Response:', data);
      }
    } catch (error) {
      console.error('Error calling n8n:', error);
    } finally {
      setIsLoading(false);
    }
    
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
          disabled={isLoading}
          className={`
            px-8 py-4 text-xl font-semibold rounded-lg transition-all duration-200
            ${isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
            }
            ${isVibrating ? 'animate-shake' : ''}
          `}
        >
          {isLoading ? 'Lädt...' : 'Klick mich!'}
        </button>
      </div>
    </div>
  );
}

export default App;
