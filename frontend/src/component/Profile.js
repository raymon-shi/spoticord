import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  Container, Button, Alert, Card, Table,
} from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import SpotifyWebApi from 'spotify-web-api-js'
import { v4 as uuidv4 } from 'uuid'

const Profile = () => {
  const [username, setUsername] = useState('')
  const [profileError, setProfileError] = useState('')
  const [recent, setRecent] = useState([])
  const { search } = useLocation()
  const [spotifyToken, setSpotifyToken] = useState('')

  const gettingUserInformation = async () => {
    try {
      const { data } = await axios.get('/account/user')
      if (data.username) {
        setUsername(data.username)
      }
    } catch (error) {
      setProfileError('There was an error trying to get the user information!')
    }
  }

  const recentSongs = async () => {
    try {
      const token = new URLSearchParams(search).get('token')
      console.log(`${token} @@@@@@@`)
      setSpotifyToken(token)
      const { data } = await axios.post('/spotify/recently', { token })
      console.log(data)
      setRecent(data)
    } catch (error) {
      setProfileError('There was an error trying to get your most recent songs!')
    }
  }

  useEffect(() => {
    recentSongs()
    const intervalID = setInterval(() => {
      recentSongs()
    }, 50000)
    return () => clearInterval(intervalID)
  }, [])

  useEffect(() => {
    gettingUserInformation()
  }, [])

  return (
    <Container>
      {profileError ? <Alert variant="danger">{profileError}</Alert> : null}
      <h1>
        Welcome to Spoticord,
        {' '}
        {username}
      </h1>
      {code}
      <h2>Recently Listened To</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Image</th>
            <th>Song Title</th>
            <th>Artist</th>
            <th>Time of Listen</th>
          </tr>
        </thead>
        <tbody>
          {recent.map(r => (
            <tr key={r.id}>
              <td>
                {' '}
                <img style={{ height: '100px' }} src={r.image} alt="" />
              </td>
              <td>{r.title}</td>
              <td>{r.name}</td>
              <td>{`${new Date(r.played).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`}</td>
            </tr>
          ))}
        </tbody>

      </Table>

    </Container>
  )
}

export default Profile
