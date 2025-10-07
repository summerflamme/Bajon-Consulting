import { supabase } from '../supabaseClient';
import './layouts.css';
import React, { useEffect, useState } from 'react';

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

  // 🔥 Liste des menus et sous-menus
  const menus = [
    {
      title: "Audits",
      link: "#accueil",
      subMenus: [
        { title: "Audit SEO", link: "#audit-seo" },
        { title: "Audit Technique", link: "#audit-technique" },
        { title: "Audit Contenu", link: "#audit-contenu" }
      ]
    },
    {
      title: "Templates",
      link: "#presentation",
      subMenus: [
        { title: "Template SEO", link: "#template-seo" },
        { title: "Template Technique", link: "#template-technique" },
        { title: "Template Contenu", link: "#template-contenu" }
      ]
    },
    { title: "Client", link: "#services" ,},
    { title: "Compte", link: "#valeurs" }
  ];

  return (
    <header className="header">
      <img src="../../public/logo-bajon-consulting.png" alt="Logo" className="header-logo" />

      <ul className={`menu ${open ? 'open' : ''}`}>
        {menus.map((menu, index) => (
          <li key={index} className={openSubMenu === index ? "open" : ""}>
            <div className="menu-item">
              <a href={menu.link}>{menu.title}</a>
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
                  <li key={subIndex}><a href={sub.link}>{sub.title}</a></li>
                ))}
              </ul>
            )}
          </li>
        ))}

        <li>
          <button type="button" onClick={handleLogout}>
            Se déconnecter
          </button>
        </li>
      </ul>

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
