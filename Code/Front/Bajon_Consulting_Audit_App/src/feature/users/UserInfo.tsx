import './users.css';

function UserInfo() {
  return (
    <>
      <div className="user-info-wrapper">
        {/* 👉 Conteneur ajouté ici */}
        <div className="user-avatar-container">
          <img
            src="../../../public/testinfoutilisateur.jpg"
            alt="Avatar utilisateur"
            className="user-avatar"
          />
        </div>

        <div className="user-info-grid">
          <div className="user-info-section">
            <h3>Informations personnelles</h3>
            <div className="user-info-row"><strong>Nom :  </strong> Alice Dupont</div>
            <div className="user-info-row"><strong>Email :  </strong> alice.dupont@example.com</div>
            <div className="user-info-row"><strong>Téléphone :  </strong> +33 6 12 34 56 78</div>
          </div>

          <div className="user-settings-section">
            <h3>Paramètres</h3>
            <div className="user-info-row"><strong>Rôle :</strong> Admin</div>
            <div className="user-info-row"><strong>Date de création :</strong> 15 janvier 2023</div>
            <div className="user-info-row"><strong>Dernière connexion :</strong> 6 octobre 2025</div>
          </div>
        </div>

        <div className="user-actions">
          <button className="btn primary">Modifier les informations</button>
          <button className="btn secondary">Mot de passe oublié</button>
        </div>
      </div>
    </>
  );
}

export default UserInfo;
