import React, { useState } from 'react'
import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom'
import Login from './component/Login'
import Profile from './component/Profile'
import Signup from './component/Signup'
import Home from './component/Home'
import NavBar from './component/NavBar'

const App = () => {
  const [user, setUser] = useState('')
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/profile/:currentuser/:profileuser" element={<Profile />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App
