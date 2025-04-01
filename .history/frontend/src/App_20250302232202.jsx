import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserProfile from "./pages/profile/profile.jsx";
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <UserProfile/>
    </>
  )
}

export default App
