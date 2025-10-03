import './App.css'
//import MenuButton from './layouts/MenuButton'
import Header from './layouts/header'
//import Footer from './layouts/Footer'
//import Sidebar from './layouts/Sidebar'
//import LoginPage from './feature/auth/LoginPage'
// import SearchBar from './components/SearchBar'
import { supabase } from './supabaseClient';
import AuditEditorPage from './components/AuditEditorPage'

function App() {

supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth event:", event);
  console.log("Nouvelle session:", session);
});

  return (
    <>
      <Header />
      <AuditEditorPage />
    </>
  )
}
export default App