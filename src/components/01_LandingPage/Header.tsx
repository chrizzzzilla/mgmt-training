import React from 'react';
import './Header.css';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header>
      <h1>Backoffice</h1>
    </header>
  );
};

export default Header;