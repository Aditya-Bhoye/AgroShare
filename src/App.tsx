import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import UserProfilePage from './pages/UserProfilePage';
import SellerDashboard from './pages/SellerDashboard';
import SellerProfile from './pages/SellerProfile';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/complete-profile" element={<UserProfilePage />} />
        <Route path="/complete-profile" element={<UserProfilePage />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/seller/:sellerId" element={<SellerProfile />} />
      </Routes>
    </Router>
  )
}

export default App

