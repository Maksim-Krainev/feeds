import React, { useState } from 'react';

const Menu = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <div className="menu_container">
      <button
        aria-label="Open menu"
        className="menu_btn_open menu_btn"
        onClick={(e) => { e.preventDefault(); toggleMenu(); }}
        style={{ display: menuVisible ? 'none' : 'block' }}
      >
        <svg width="30px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20M4 12H14M4 18H9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button
        aria-label="Close menu"
        className="menu_btn_close menu_btn"
        onClick={(e) => { e.preventDefault(); toggleMenu(); }}
        style={{ display: menuVisible ? 'block' : 'none' }}
      >
        <svg width="20px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21L12 12M12 12L3 3M12 12L21.0001 3M12 12L3 21.0001" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className={`menu_box ${menuVisible ? 'menu_box_visible' : ''}`}>
        <a href="/" className="menu_item">Home</a>
        <a href="/channels" className="menu_item">Channels</a>
      </div>
    </div>
  );
};

export default Menu;
