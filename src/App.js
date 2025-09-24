import React from 'react';
import './App.css';
import Header from './components/Header';
import TrainingContent from './components/TrainingContent';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <TrainingContent />
      </main>
    </div>
  );
}

export default App;