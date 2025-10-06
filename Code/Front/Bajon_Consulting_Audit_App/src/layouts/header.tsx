import MenuButton from './MenuButton';
import './layouts.css';

function Header() {
  return (
    <header className="header">
      <a href="index.tsx">
        <img src="../../public/logo-bajon-consulting.png" alt="Logo" className="header-logo" />
      </a>
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