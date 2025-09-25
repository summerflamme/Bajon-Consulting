import './auth.css';

function LoginPage() {
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