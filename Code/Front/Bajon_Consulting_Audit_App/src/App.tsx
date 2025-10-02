import './App.css'
//import MenuButton from './layouts/MenuButton'
import Header from './layouts/header'
import Footer from './layouts/Footer'
//import Sidebar from './layouts/Sidebar'
import LoginPage from './feature/auth/LoginPage'
import AuditForm from './components/AuditForm'


function App() {
  return (
    <>
      <Header />
      <AuditForm />
      <Footer />
    </>
  )
}
export default App