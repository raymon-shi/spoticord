import React, { useState } from 'react'
import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom'
import Login from './component/Login'
import Profile from './component/Profile'
import Signup from './component/Signup'
import Home from './component/Home'

const App = () => {
  const [user, setUser] = useState('')
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
