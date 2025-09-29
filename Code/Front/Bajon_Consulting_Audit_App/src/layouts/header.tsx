import MenuButton from './MenuButton';
import './layouts.css';

function Header() {
  return (
    <header className="header">
      <img src="../../public/vite.svg" alt="Logo" className="header-logo" />
      <div className="header-spacer" />
      <ul className='navigation'>
        <li>Audits</li>
        <li>Templates</li>
        <li>Client</li>
        <li>Compte</li>
      </ul>
    </header>
  );
}

export default Header;