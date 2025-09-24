import MenuButton from './MenuButton';
import './layouts.css';

function Header() {
  return (
    <header className="header">
      <img src="../../public/vite.svg" alt="Logo" className="header-logo" />
      <div className="header-spacer" />
      <MenuButton />
    </header>
  );
}

export default Header;