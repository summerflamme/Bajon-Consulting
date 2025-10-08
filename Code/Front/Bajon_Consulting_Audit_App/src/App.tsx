import './App.css';
import { supabase } from './supabaseClient';
import AppRoutes from './routes/AppRoutes';

function App() {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth event:", event);
    console.log("Nouvelle session:", session);
  });

  return <AppRoutes />;
}

export default App;
