import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
// import GoogleAuth from './pages/GoogleAuth'
import { Outlet, Router } from 'react-router-dom'
// import { AuthProvider } from './context/AuthContext'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>


      <Outlet />


    </>
  )
}

export default App
