import React from 'react';

const Header = () => {
  return (
    <header style={{ 
      backgroundColor: '#282c34', 
      padding: '20px', 
      color: 'white' 
    }}>
      <h1>Training App</h1>
      <nav>
        <p>Willkommen zu Ihrer React Training Anwendung</p>
      </nav>
    </header>
  );
};

export default Header;