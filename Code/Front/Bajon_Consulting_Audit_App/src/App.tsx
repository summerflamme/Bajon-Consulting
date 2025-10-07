import './App.css';
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
