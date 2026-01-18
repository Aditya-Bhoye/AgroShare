import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/complete-profile" element={<UserProfilePage />} />
      </Routes>
    </Router>
  )
}

export default App
