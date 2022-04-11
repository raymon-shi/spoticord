/* eslint-disable consistent-return */
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  Container, Alert, Card, Table, Tabs, Tab,
} from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'

const Profile = () => {
  const [profilePerson, setProfilePerson] = useState({})
  const [profileError, setProfileError] = useState('')
  const [artist, setArtist] = useState([])
  const [tracks, setTracks] = useState([])
  const [mode, setMode] = useState('tracks')
  const { currentuser, profileuser } = useParams()

  const navigate = useNavigate()

  const getProfileUserInformation = async () => {
    try {
      const { data } = await axios.post('/account/profile', { profileuser })
      setProfilePerson(data)
      setArtist(data.artists)
      setTracks(data.tracks)
    } catch (error) {
      navigate('/')
      setProfileError('There was an error trying to get the user information!')
    }
  }

  const topTracks = async () => {
    try {
      const { data } = await axios.get('/spotify/myTopTracks')
      setTracks(data)
    } catch (error) {
      setProfileError('There was an error trying to get your most top songs!')
    }
  }

  const topAritsts = async () => {
    try {
      const { data } = await axios.get('/spotify/myTopArtists')
      setArtist(data)
    } catch (error) {
      setProfileError('There was an error trying to get your most top artists!')
    }
  }

  useEffect(() => {
    getProfileUserInformation()
    if (currentuser === profileuser) {
      topTracks()
      topAritsts()
    }
    const intervalID = setInterval(() => {
      if (currentuser === profileuser) {
        topTracks()
        topAritsts()
      }
    }, 60000)
    return () => clearInterval(intervalID)
  }, [])

  const myTopTracksView = () => (
    <>
      <h2>Top Tracks</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Track Name</th>
            <th>Artist Name</th>
            <th>Album Name</th>
            <th>Album Type</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((t, index) => (
            <tr key={t.id}>
              <td>{index + 1}</td>
              <td>
                {' '}
                <img style={{ height: '100px' }} src={t.image} alt="" />
              </td>
              <td>{t.name}</td>
              <td>{t.artist}</td>
              <td>{t.album}</td>
              <td>{t.type}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )

  const myTopArtistView = () => (
    <>
      <h2>Top Artist</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Genres</th>
          </tr>
        </thead>
        <tbody>
          {artist.map((a, index) => (
            <tr key={a.id}>
              <td>{index + 1}</td>
              <td>
                {' '}
                <img style={{ height: '100px' }} src={a.image} alt="" />
              </td>
              <td>{a.name}</td>
              <td>{a.genres}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )

  return (
    <Container>
      <NavBar username={currentuser} />
      {profileError ? <Alert variant="danger">{profileError}</Alert> : null}
      <h1>{`${profilePerson.username}'s Profile`}</h1>
      <Card style={{ width: '18rem' }} className="mb-5">
        <Card.Img variant="top" src={profilePerson.image} />
        <Card.Body>
          <Card.Title>{profilePerson.fullname}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{profilePerson.username}</Card.Subtitle>
          <br />
          <Card.Subtitle className="mb-2 text-muted">{profilePerson.bio}</Card.Subtitle>
          <Card.Subtitle className="mb-2 text-muted">{profilePerson.location}</Card.Subtitle>
          <Card.Subtitle className="mb-2 text-muted">{profilePerson.birthday}</Card.Subtitle>

        </Card.Body>
      </Card>
      <Tabs
        id="controlled-tab-example"
        activeKey={mode}
        onSelect={m => setMode(m)}
        className="mb-3"
      >
        <Tab eventKey="tracks" title="Top Tracks">
          {myTopTracksView()}
        </Tab>
        <Tab eventKey="artists" title="Top Artists">
          {myTopArtistView()}
        </Tab>
      </Tabs>
    </Container>
  )
}

export default Profile
