import { useState } from 'react'
import './App.css'
import UserProfile from "./pages/profile/profile.jsx";
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <UserProfile/>
  <Route path="/me" element={<UserProfile/>}/>{' '}
    </>
  )
}

export default App
