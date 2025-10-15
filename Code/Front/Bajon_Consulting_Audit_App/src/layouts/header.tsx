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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 800);
      if (window.innerWidth > 800 && open) {
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

  const menus = [
    { title: "Audits", link: "#services" },
    { title: "Templates", link: "#services" },
    { title: "Clients", link: "#services" },
    {
      title: "Audits",
      link: "audits",
      subMenus: [
        { title: "Mes informations", link: "/users/info" },
        { title: "Liste des utilisateurs", link: "/users/list" },
      ]
    }
  ];

  return (
    <header className="header">
      <a href="/">
        <img
          src="../../src/assets/logo-bajon-consulting.png"
          alt="Logo"
          className="header-logo"
        />
      </a>

      <ul className={`menu ${open ? 'open' : ''}`}>
        {menus.map((menu, index) => (
          <li
            key={index}
            className={`menu-item-container ${openSubMenu === index ? "open" : ""}`}
          >
            <div className="menu-item">
              <a href={menu.link} className="menu-link">
                {menu.title}
              </a>
              {menu.subMenus && isMobile && (
                <i
                  className={`bx ${openSubMenu === index ? "bx-chevron-up" : "bx-chevron-down"} arrow`}
                  onClick={() => toggleSubMenu(index)}
                />
              )}
            </div>

            {menu.subMenus && (
              <ul className="sub-menu">
                {menu.subMenus.map((sub, subIndex) => (
                  <li key={subIndex} className="sub-menu-item">
                    <a href={sub.link} className="sub-menu-link">
                      {sub.title}
                    </a>
                  </li>
                ))}

                {menu.title === "Utilisateurs" && (
                  <li className="sub-menu-item logout-item">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="logout-button logout-in-submenu"
                    >
                      Se déconnecter
                    </button>
                  </li>
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {isMobile && (
        <div className="mobile-button">
          <button
            id="menu-icon"
            aria-controls="main-navigation"
            aria-expanded={open}
            onClick={toggleMenu}
            className="menu-toggle bx bx-menu"
            type="button"
          />
        </div>
      )}
    </header>
  );


}

export default Header;




