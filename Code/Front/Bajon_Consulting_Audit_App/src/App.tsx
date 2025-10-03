import './App.css'
//import MenuButton from './layouts/MenuButton'
import Header from './layouts/header'
import Footer from './layouts/Footer'
//import Sidebar from './layouts/Sidebar'
//import LoginPage from './feature/auth/LoginPage'
import AuditCard from './components/AuditCard'

function App() {
  return (
    <>
      <Header />
      <AuditCard />
      <Footer />
    </>
  )
}
export default App