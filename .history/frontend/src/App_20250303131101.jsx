import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import UserProfile from "./pages/profile/profile.jsx";
import EditUserProfile from './pages/profile/editProfile.jsx';
import SignupPage from './pages/authentication/signup.jsx';
import LoginPage from './pages/authentication/login.jsx';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <Router>
    <Routes>
    <Route path="/me" element={<UserProfile/>}/>{' '}
    <Route path="/editProfile" element={<EditUserProfile/>}/>{' '}
    <Route path="/signup" element={<SignupPage/>}/>{' '}
    <Route path="/login" element={<LoginPage/>}/>{' '}
    </Routes>
  
  </Router>
  
    </>
  )
}

export default App
