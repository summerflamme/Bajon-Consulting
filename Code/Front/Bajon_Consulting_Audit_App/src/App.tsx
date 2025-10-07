<<<<<<< HEAD
import './App.css'
import Header from './layouts/header'
import Footer from './layouts/Footer'
//import Sidebar from './layouts/Sidebar'
//import LoginPage from './feature/auth/LoginPage'
// import SearchBar from './components/SearchBar'
// import LoginPage from './feature/auth/LoginPage';
import UserForm from './components/UserForm';
=======
import './App.css';
>>>>>>> f87c26c3d7b949f4eee318729eaec0cfe4df8aae
import { supabase } from './supabaseClient';
import AppRoutes from './routes/AppRoutes';

function App() {
  // Écoute des événements d'authentification Supabase
  supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth event:", event);
    console.log("Nouvelle session:", session);
  });

  return <AppRoutes />; // On ne met plus Header/Footer ici
}

export default App;
