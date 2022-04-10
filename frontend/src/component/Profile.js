/* eslint-disable consistent-return */
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  Container, Button, Alert, Card, Table, Tabs, Tab, ListGroup, ListGroupItem,
} from 'react-bootstrap'
import { useLocation, useParams, useNavigate } from 'react-router-dom'

const Profile = () => {
  const [profilePerson, setProfilePerson] = useState({})
  const [profileError, setProfileError] = useState('')
  const [recent, setRecent] = useState([])
  const [artist, setArtist] = useState([])
  const [tracks, setTracks] = useState([])
  const [mode, setMode] = useState('recent')
  const { id } = useParams()

  const navigate = useNavigate()
  const location = useLocation()
  const { state } = location
  const { currentUser } = state

  const getProfileUserInformation = async () => {
    try {
      const { data } = await axios.post('/account/profile', { _id: id })
      setProfilePerson(data)
      return data.username
    } catch (error) {
      navigate('/')
      setProfileError('There was an error trying to get the user information!')
    }
  }

  const recentSongs = async () => {
    try {
      const { data } = await axios.post('/spotify/recently', { _id: id })
      setRecent(data)
    } catch (error) {
      setProfileError('There was an error trying to get your most recent songs!')
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

  const topTracks = async () => {
    try {
      const { data } = await axios.get('/spotify/myTopTracks')
      setTracks(data)
    } catch (error) {
      setProfileError('There was an error trying to get your most top songs!')
    }
  }

  const recentlyListenedToView = () => (
    <>
      <h2>Recently Listened To</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Song Title</th>
            <th>Artist</th>
            <th>Time of Listen</th>
          </tr>
        </thead>
        <tbody>
          {recent.map((r, index) => (
            <tr key={r.id}>
              <td>{index}</td>
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
  // useEffect(() => {
  //   getProfileUserInformation()
  //   const intervalID = setInterval(() => {
  //     getProfileUserInformation()
  //   }, 5000)
  //   return () => clearInterval(intervalID)
  // }, [])

  useEffect(() => {
    getProfileUserInformation().then(res => {
      console.log(res + currentUser)
      if (res === currentUser) {
        recentSongs()
        topAritsts()
        topTracks()
        const intervalID = setInterval(() => {
          recentSongs()
          topAritsts()
          topTracks()
        }, 50000)
        return () => clearInterval(intervalID)
      }
      const intervalID = setInterval(() => {
        getProfileUserInformation()
      }, 2000)
      return () => clearInterval(intervalID)
    })
    return undefined
  }, [])

  return (
    <Container>
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
        defaultActiveKey="recent"
        id="controlled-tab-example"
        activeKey={mode}
        onSelect={m => setMode(m)}
        className="mb-3"
      >
        <Tab eventKey="recent" title="Recently Listened To">
          {recentlyListenedToView()}
        </Tab>
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
