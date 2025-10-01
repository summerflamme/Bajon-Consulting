import './App.css'
//import MenuButton from './layouts/MenuButton'
import Header from './layouts/header'
import Footer from './layouts/Footer'
//import Sidebar from './layouts/Sidebar'
//import LoginPage from './feature/auth/LoginPage'
import SearchBar from './components/SearchBar'

function App() {
  return (
    <>
      <Header />
      <SearchBar/>
      <Footer />
    </>
  )
}
export default App