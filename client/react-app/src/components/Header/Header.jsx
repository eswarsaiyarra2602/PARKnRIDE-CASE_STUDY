import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">PARKnRIDE</h1>
      </div>
      <div className="header-right">
        <input
          type="text"
          className="search-bar"
          placeholder="Search for cabs / parking locations"
        />
        <button className="notification-btn">
          <i className="fas fa-bell"></i>
          <span className="badge">3</span>
        </button>
        <button className="login-btn">Login</button>
      </div>
    </header>
  );
};

export default Header;