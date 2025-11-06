import './users.css';
import avatarImage from "../../assets/testinfoutilisateur.png";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../feature/auth/useAuth"; // Assure-toi du bon chemin

interface User {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  currentRole?: string | null;
  created_at?: string | null;
  last_sign_in_at?: string | null;
}

function UserInfo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, currentRole } = useAuth(); // Récupère l'utilisateur courant
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Si l'utilisateur n'est pas admin et tente d'accéder à un autre ID
    if (currentRole !== "Administrateur" && currentUser?.id !== id) {
      navigate("/audits"); // Redirection
      return;
    }

    axios
      .get(`http://localhost:8080/api/users/${id}`)
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement de l'utilisateur :", error);
        setLoading(false);
      });
  }, [id, currentRole, currentUser, navigate]);

  if (loading) return <div>Chargement...</div>;
  if (!user) return <div>Aucun utilisateur trouvé.</div>;

  return (
    <div className="user-info-wrapper">
      <div className="user-avatar-container">
        <img
          src={avatarImage}
          alt="Avatar utilisateur"
          className="user-avatar"
        />
      </div>

      <div className="user-info-grid">
        <div className="user-info-section">
          <h3>Informations personnelles</h3>
          <div className="user-info-row"><strong>Nom :</strong> {user.lastName ?? '-'}</div>
          <div className="user-info-row"><strong>Prénom :</strong> {user.firstName ?? '-'}</div>
          <div className="user-info-row"><strong>Email :</strong> {user.email ?? '-'}</div>
          <div className="user-info-row"><strong>Téléphone :</strong> {user.phone ?? '-'}</div>
        </div>

        <div className="user-settings-section">
          <h3>Paramètres</h3>
          <div className="user-info-row"><strong>Rôle :</strong> {user.currentRole ?? '-'}</div>
          <div className="user-info-row"><strong>Date de création :</strong> 
            {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
          </div>
          <div className="user-info-row"><strong>Dernière connexion :</strong> 
            {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : '-'}
          </div>
        </div>
      </div>

      <div className="user-actions">
        <button className="btn primary">Modifier les informations</button>
        <button className="btn secondary">Mot de passe oublié</button>
      </div>
    </div>
  );
}

export default UserInfo;
