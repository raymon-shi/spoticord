import axios from 'axios'
import React, { useState } from 'react'
import {
  Container, Form, Button, Alert,
} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fullname, setFullname] = useState('')
  const [bio, setBio] = useState('')
  const [birthday, setBirthday] = useState('')
  const [location, setLocation] = useState('')
  const [token, setToken] = useState('')
  const [imageLink, setImageLink] = useState('')
  const [signupError, setSignupError] = useState('')
  const navigate = useNavigate()

  const spotifyLogin = async () => {
    try {
      const { data } = await axios.get('/spotify/login')
      window.open(data)
    } catch (error) {
      setSignupError('Spotify login was unsuccessful!')
    }
  }

  const signingUp = async () => {
    try {
      await Promise.all([
        await axios.post('/account/signup', {
          username, password, image: imageLink, token, fullname, bio, birthday, location,
        }),
        await axios.post('/account/login', { username, password, token }),
      ]).then(() => navigate('/'))
    } catch (error) {
      setSignupError('User creation was unsuccessul! Username already in use!')
    }
  }

  return (
    <Container className="w-25" style={{ float: 'left', position: 'flex' }}>
      <h1 style={{ fontWeight: 'bold' }}>Sign Up</h1>
      <Form className="p-3 bg-light" onSubmit={e => e.preventDefault()}>
        {signupError ? <Alert variant="danger">{signupError}</Alert> : null}

        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter your username..." value={username} onChange={e => setUsername(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter your password..." value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicFullname">
          <Form.Label>Full Name</Form.Label>
          <Form.Control type="text" placeholder="Enter your full name..." value={fullname} onChange={e => setFullname(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicBio">
          <Form.Label>Short Bio</Form.Label>
          <Form.Control as="textarea" placeholder="Enter your short bio..." value={bio} onChange={e => setBio(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicBirthday">
          <Form.Label>Birthday</Form.Label>
          <Form.Control type="text" placeholder="Enter your birthday..." value={birthday} onChange={e => setBirthday(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicLocation">
          <Form.Label>Location</Form.Label>
          <Form.Control type="text" placeholder="Enter your location..." value={location} onChange={e => setLocation(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Profile Picture Link</Form.Label>
          <Form.Control
            type="text"
            onChange={e => setImageLink(e.target.value)}
            placeholder="Enter your profile URL..."
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicToken">
          <Form.Label>Access Token</Form.Label>
          <Form.Control type="password" placeholder="Enter your access token..." value={token} onChange={e => setToken(e.target.value)} />
        </Form.Group>

        <Button style={{ background: '#1ED760' }} type="submit" className="w-100" onClick={spotifyLogin}>
          Spotify Login Code
        </Button>
        <Button style={{ background: '#5865F2' }} type="submit" className="w-100 mt-2" onClick={signingUp}>
          Sign Up
        </Button>
        <Form.Text className="text-muted">
          Already have an account?
          {' '}
          <Link to="/login">Log in here!</Link>
        </Form.Text>
      </Form>
    </Container>
  )
}

export default Signup
