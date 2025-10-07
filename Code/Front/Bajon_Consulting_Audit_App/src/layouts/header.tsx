import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './layouts.css'; 

function Header() {
const handleLogout = async () => {
    console.log("Déconnexion en cours de l'utilisateur", sessionStorage.getItem("user"));
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erreur lors de la déconnexion:", error.message);
    } else {
      console.log("Déconnexion réussie");
      sessionStorage.removeItem("user");
    }
  };
  
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768 && open) {
        setOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open]);

  const toggleMenu = () => setOpen(prev => !prev);

  const toggleSubMenu = (index: number) => {
    setOpenSubMenu(prev => (prev === index ? null : index));
  };

  return (
    <header className="header">
      <img src="../../public/logo-bajon-consulting.png" alt="Logo" className="header-logo" />
      <ul className={`menu ${open ? 'open' : ''}`}>
        
        {/* AUDITS */}
        <li className={openSubMenu === 0 ? "open" : ""}>
          <div className="menu-item">
            <a href="#accueil">Audits</a>
            {isMobile && (
              <i 
              className={`bx ${openSubMenu === 0 ? "bx-chevron-up" : "bx-chevron-down"} arrow`}
              onClick={() => toggleSubMenu(0)}
              />
            )}
            </div>
          <ul className="sub-menu">
            <li><a href="#audit-seo">Audit SEO</a></li>
            <li><a href="#audit-technique">Audit Technique</a></li>
            <li><a href="#audit-contenu">Audit Contenu</a></li>
          </ul>
        </li>

        {/* TEMPLATES */}
        <li className={openSubMenu === 1 ? "open" : ""}>
          <div className="menu-item">
            <a href="#presentation">Templates</a>
            {isMobile && (
              <i 
              className={`bx ${openSubMenu === 1 ? "bx-chevron-up" : "bx-chevron-down"} arrow`}
              onClick={() => toggleSubMenu(1)}
              />
            )}
            </div>
          <ul className="sub-menu">
            <li><a href="#template-seo">Template SEO</a></li>
            <li><a href="#template-technique">Template Technique</a></li>
            <li><a href="#template-contenu">Template Contenu</a></li>
          </ul>
        </li>

        <li><a href="#services">Client</a></li>
        <li><a href="#valeurs">Compte</a></li>
      </ul>


      <button type="button" onClick={handleLogout}>
            Se déconnecter
          </button>
      {isMobile && (
        <div className="main">
          <button
            id="menu-icon"
            aria-controls="main-navigation"
            aria-expanded={open}
            onClick={toggleMenu}
            className="bx bx-menu"
            style={{ color: 'black' }}
            type="button"
          />
        </div>
      )}
    </header>
  );
}

export default Header;
