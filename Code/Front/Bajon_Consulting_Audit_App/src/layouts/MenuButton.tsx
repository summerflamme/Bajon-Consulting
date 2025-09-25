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
          <li><a href="#accueil">Accueil</a></li>
          <li><a href="#presentation">Audits</a></li>
          <li><a href="#services">Templates</a></li>
          <li><a href="#valeurs">Plus (nouveau)</a></li>
          <li><a href="#partenaires">infoUtilisateur</a></li>
        </ul>
      )}
    </div>
  );
}

export default MenuButton;