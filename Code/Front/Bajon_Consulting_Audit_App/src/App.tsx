import './App.css'
//import MenuButton from './layouts/MenuButton'
import Header from './layouts/header'
//import Footer from './layouts/Footer'
//import Sidebar from './layouts/Sidebar'
//import LoginPage from './feature/auth/LoginPage'
// import SearchBar from './components/SearchBar'
// import LoginPage from './feature/auth/LoginPage'
//import UserForm from './components/UserForm'
import { supabase } from './supabaseClient';
//import AuditList from './components/AuditList';
import UserList from './components/UserListPage';

function App() {

supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth event:", event);
  console.log("Nouvelle session:", session);
});

  return (
    <>
      <Header />
      <UserList/>
    </>
  )
}
export default App