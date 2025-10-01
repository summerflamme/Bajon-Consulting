import { useEffect } from 'react';
import './auth.css';
import { fetchUsers } from './authService';

function LoginPage() {
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        console.log('Données utilisateurs récupérées:', users);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    };

    loadUsers();
  }, []);
  return (
    <div className="background-zone">
      {
        <div className="login-box">
            <h2>Connexion</h2>
            <form>
            <label htmlFor="username">Identifiant</label>
            <input type="text" id="username" name="username" />

            <label htmlFor="password">Mot de passe</label>
            <input type="password" id="password" name="password" />

            <button type="submit">Valider</button>

            <div className="forgot-password">
                <a href="#">Mot de passe oublié ?</a>
            </div>
            </form>
        </div>
      }
    </div>
  );

}

export default LoginPage;