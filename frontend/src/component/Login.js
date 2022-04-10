import React, { useState } from 'react'
import {
  Container, Form, Button, Alert,
} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [loginError, setLoginError] = useState('')

  const navigate = useNavigate()

  const spotifyLogin = async () => {
    try {
      const { data } = await axios.get('/spotify/login')
      window.open(data)
    } catch (error) {
      setLoginError('Spotify login was unsuccessful!')
    }
  }

  const loggingIn = async () => {
    try {
      await axios.post('/account/login', { username, password, token })
      navigate('/')
    } catch (error) {
      console.log(error)
      setLoginError('Logging in was unsuccessful! Check login information!')
    }
  }

  return (
    <Container className="w-25" style={{ float: 'left', position: 'flex' }}>
      <h1 style={{ fontWeight: 'bold' }}>Login</h1>
      <Form onSubmit={e => e.preventDefault()}>
        {loginError ? <Alert variant="danger">{loginError}</Alert> : null}
        <Form.Group className="mb-3" controlId="formBasicUsername" value={username} onChange={e => setUsername(e.target.value)}>
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username..." value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter password..." />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicToken">
          <Form.Label>Access Token</Form.Label>
          <Form.Control type="password" placeholder="Enter access token..." value={token} onChange={e => setToken(e.target.value)} />
        </Form.Group>
        <div>
          <Button style={{ background: '#1ED760' }} type="submit" className="w-100" onClick={spotifyLogin}>
            Spotify Login Code
          </Button>
          <Button style={{ background: '#5865F2' }} type="submit" className="w-100 mt-2" onClick={loggingIn}>
            Login
          </Button>
        </div>
        <Form.Text className="text-muted">
          Dont have an account?
          {' '}
          <Link to="/signup" style={{ color: '#5865F2' }}>Signup here!</Link>
        </Form.Text>
      </Form>
    </Container>
  )
}

export default Login
