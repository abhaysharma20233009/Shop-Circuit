import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import UserProfile from "./pages/profile/profile.jsx";
import EditUserProfile from './pages/profile/editProfile.jsx';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <Router>
    <Routes>
    <Route path="/me" element={<UserProfile/>}/>{' '}
    <Route path="/editProfile" element={<EditUserProfile/>}/>{' '}
    </Routes>
  
  </Router>
  
    </>
  )
}

export default App
