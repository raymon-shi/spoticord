import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './component/Login'
import Profile from './component/Profile'
import Signup from './component/Signup'

const App = () => {
  const [user, setUser] = useState('')
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
