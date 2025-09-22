import './NavBar.css'

function NavBar() {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li><a href="#accueil">Accueil</a></li>
        <li><a href="#presentation">Audits</a></li>
        <li><a href="#services">Templates</a></li>
        <li><a href="#valeurs">Plus(nouveau)</a></li>
        <li><a href="#partenaires">infoUtilisateur</a></li>
      </ul>
    </nav>
  )
}

export default NavBar
