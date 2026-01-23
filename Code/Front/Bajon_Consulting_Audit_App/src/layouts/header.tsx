import { useEffect, useState } from "react";
import { MenuIcon } from "../components/ui/menu";
import { LogoutIcon } from "../components/ui/logout";
import { UserIcon } from "../components/ui/user";
import { ChevronDownIcon } from "../components/ui/chevron-down";
import { useAuth } from "../feature/auth/useAuth";

/**
 * MenuToggleButton
 *
 * Bouton pour afficher / cacher le menu mobile
 */
export function MenuToggleButton({
  onToggle,
  open,
}: {
  onToggle?: () => void;
  open: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle menu"
      className="p-2 rounded-md hover:bg-gray-200"
    >
      <MenuIcon open={open} className="menu-icon" />
    </button>
  );
}

/**
 * Header
 *
 * Affiche le header de l'application avec :
 * - Logo
 * - Menu principal (Audits, Templates, Clients, User)
 * - Sous-menus avec restrictions selon le rôle
 * - Bouton de déconnexion
 */
export default function Header() {
  const { currentUser, currentRole, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);

  const toggleMenu = () => setOpen((prev) => !prev);
  const toggleSubMenu = (index: number) =>
    setOpenSubMenu((prev) => (prev === index ? null : index));

  const menus = [
    { id: "audits", title: "Audits", link: "/audits" },
    { id: "templates", title: "Templates", link: "/templates" },
    { id: "clients", title: "Clients", link: "/clients/list" },
    {
      id: "user",
      title: <UserIcon size={28} />,
      subMenus: [
        {title: "Mes informations", link: currentUser ? `/users/info/${currentUser.id}` : "/users/info"},
        { title: "Liste des utilisateurs", link: "/users/list" },
      ],
    },
  ];

  // Ajuste l'affichage selon la taille de l'écran
  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 800);
      if (window.innerWidth > 800 && open) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  return (
    <header className="header">
      <a href="/">
        <img
          src="../../src/assets/logo-bajon-consulting.png"
          alt="Logo"
          className="header-logo"
        />
      </a>

      {currentUser && (
        <>
          <ul className={`menu ${open ? "open" : ""}`}>
            {menus.map((menu, index) => (
              <li
                key={menu.id}
                className={`menu-item-container ${
                  openSubMenu === index ? "open" : ""
                }`}
              >
                <div className="menu-item">
                  <a href={menu.link} className="menu-link">
                    {menu.title}
                  </a>

                  {menu.subMenus && isMobile && (
                    <ChevronDownIcon
                      className={`arrow ${
                        openSubMenu === index ? "rotate-180" : ""
                      }`}
                      onClick={() => toggleSubMenu(index)}
                    />
                  )}
                </div>

                {menu.subMenus && (
                  <ul className="sub-menu">
                    {menu.subMenus.map((sub, subIndex) => {
                      // Restriction affichage selon le rôle
                      if (
                        sub.title === "Liste des utilisateurs" &&
                        currentRole !== "Administrateur"
                      ) {
                        return null;
                      }
                      return (
                        <li key={subIndex} className="sub-menu-item">
                          <a href={sub.link} className="sub-menu-link">
                            {sub.title}
                          </a>
                        </li>
                      );
                    })}

                    {menu.id === "user" && (
                      <li className="sub-menu-item logout-item">
                        <button
                          type="button"
                          onClick={logout}
                          className="logout-button logout-in-submenu"
                        >
                          <LogoutIcon size={28} />
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
              <MenuToggleButton onToggle={toggleMenu} open={open} />
            </div>
          )}
        </>
      )}
    </header>
  );
}
