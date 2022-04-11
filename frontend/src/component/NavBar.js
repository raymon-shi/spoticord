import React, { useState } from 'react'
import { Navbar, Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'
import logo from '../assets/sc.png'

const NavBar = ({ username }) => {
  const [navBarError, setNavBarError] = useState('')
  // logging the user out
  const logout = async () => {
    try {
      await axios.post('/account/logout')
    } catch (error) {
      console.log(error)
      setNavBarError('Error logging out')
    }
  }
  return (
    <>
      <Navbar>
        <Container>
          <Navbar.Brand
            href="/"
          >
            <img
              alt=""
              src={logo}
              width="321"
              height="61"
              className="d-inline-block align-top"
            />
            {' '}
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Signed in as:
              {' '}
              <a href={`/profile/${username}/${username}`}>{username}</a>
              {' | '}
            </Navbar.Text>
            <Navbar.Text>
              <Link onClick={logout} to="/login">Log out</Link>
            </Navbar.Text>

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default NavBar
