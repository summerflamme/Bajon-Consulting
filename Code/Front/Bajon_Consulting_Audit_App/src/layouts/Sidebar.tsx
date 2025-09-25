import React from 'react';
import './layouts.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li><a href="#">Tout</a></li>
          <li><a href="#">Transformation numérique et gouvernance</a></li>
          <li><a href="#">Cybersécurité & conformité</a></li>
          <li><a href="#">Cloud & ERP</a></li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;