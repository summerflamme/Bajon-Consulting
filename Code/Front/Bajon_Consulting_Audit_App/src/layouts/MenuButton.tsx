import { useState } from 'react';
import './layouts.css';

function MenuButton() {
  const [menuVisible, setMenuVisible] = useState(false);
  

  const toggleMenu = () => {
    setMenuVisible(prev => !prev);
  };

  return (
    <div className="menu-button-container">
      <button className="menu-button" onClick={toggleMenu}>☰ Menu</button>

      {menuVisible && (
        <ul className="menu-list">
          <li><a href="#accueil">Audits</a></li>
          <li><a href="#Audits">Templates</a></li>
          <li><a href="#Client">Client</a></li>
          <li><a href="#compte">Compte</a></li>
        </ul>
      )}
    </div>
  );
}

export default MenuButton;