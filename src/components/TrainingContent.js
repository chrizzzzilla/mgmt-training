import React, { useState } from 'react';

const TrainingContent = () => {
  const [currentTopic, setCurrentTopic] = useState('basics');
  
  const topics = {
    basics: {
      title: 'React Grundlagen',
      content: 'Hier lernen Sie die Grundlagen von React: Komponenten, Props und State.'
    },
    hooks: {
      title: 'React Hooks',
      content: 'Verstehen Sie useState, useEffect und andere wichtige React Hooks.'
    },
    advanced: {
      title: 'Erweiterte Konzepte',
      content: 'Context API, Routing und Performance-Optimierung in React.'
    }
  };

  return (
    <div className="training-section">
      <h2>Trainingsinhalt</h2>
      
      <div style={{ marginBottom: '20px' }}>
        {Object.keys(topics).map(key => (
          <button 
            key={key}
            onClick={() => setCurrentTopic(key)}
            style={{ 
              margin: '0 10px',
              backgroundColor: currentTopic === key ? '#0056b3' : '#007bff'
            }}
          >
            {topics[key].title}
          </button>
        ))}
      </div>
      
      <div className="training-item">
        <h3>{topics[currentTopic].title}</h3>
        <p>{topics[currentTopic].content}</p>
      </div>
      
      <div className="training-item">
        <h4>Interaktive Elemente</h4>
        <button onClick={() => alert('Training gestartet!')}>
          Training starten
        </button>
      </div>
    </div>
  );
};

export default TrainingContent;