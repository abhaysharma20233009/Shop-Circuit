import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import UserProfile from "./pages/profile/profile.jsx";
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <Router>
  <Route path="/me" element={<UserProfile/>}/>{' '}
  </Router>
  
    </>
  )
}

export default App
