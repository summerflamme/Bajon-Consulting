import { supabase } from '../supabaseClient';
import MenuButton from './MenuButton';
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
  
  return (
    <header className="header">
      <img src="../../public/logo-bajon-consulting.png" alt="Logo" className="header-logo" />
      <div className="header-spacer" />
      <ul className='navigation'>
        <li>Audits</li>
        <li>Templates</li>
        <li>Client</li>
        <li>Compte</li>
      </ul>


      <button type="button" onClick={handleLogout}>
            Se déconnecter
          </button>
    </header>
  );
}

export default Header;