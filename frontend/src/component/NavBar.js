import React, { useState, useEffect } from 'react'
import { Navbar, Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'
import logo from '../assets/sc.png'

const NavBar = () => {
  const [navBarError, setNavBarError] = useState('')
  const [user, setUser] = useState('')
  // logging the user out
  const logout = async () => {
    try {
      await axios.post('/account/logout')
    } catch (error) {
      console.log(error)
      setNavBarError('Error logging out')
    }
  }

  // get the current user information
  const getUser = async () => {
    try {
      const { data } = await axios.get('/account/user')
      setUser(data.username)
    } catch (error) {
      setNavBarError('Error getting users')
    }
  }

  // get the user once on refresh
  useEffect(() => {
    getUser()
  }, [])

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
              <a href={`/profile/${user}/${user}`}>{user}</a>
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
