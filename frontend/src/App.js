import React from 'react'
import {
  BrowserRouter, Routes, Route,
} from 'react-router-dom'
import Login from './component/Login'
import Profile from './component/Profile'
import Signup from './component/Signup'
import Home from './component/Home'
import Chatroom from './component/Chatroom'

const App = () => (
  <>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/profile/:currentuser/:profileuser" element={<Profile />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/chatroom" element={<Chatroom />} />
      </Routes>
    </BrowserRouter>
  </>

)

export default App
