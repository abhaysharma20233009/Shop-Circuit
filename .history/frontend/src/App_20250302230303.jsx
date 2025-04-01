import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserProfile from "./pages/profile.jsx";
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <h1 class="text-3xl font-bold underline bg-green-500">
    Hello world!
  </h1>
    
    </>
  )
}

export default App
