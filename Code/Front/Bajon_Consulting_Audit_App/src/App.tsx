import './App.css'
//import MenuButton from './layouts/MenuButton'
import Header from './layouts/header'
import Footer from './layouts/Footer'
//import Sidebar from './layouts/Sidebar'
//import SearchBar from './components/SearchBar'
import LoginPage from './feature/auth/LoginPage'
import { supabase } from './supabaseClient';
//import AuditList from './components/AuditList';

function App() {

supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth event:", event);
  console.log("Nouvelle session:", session);
});

  return (
    <>
      <Header />
      <LoginPage />
      <Footer />
    </>
  )
}
export default App