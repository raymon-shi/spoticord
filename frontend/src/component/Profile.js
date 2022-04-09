import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  Container, Button, Alert, Card, Table, Tabs, Tab,
} from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import SpotifyWebApi from 'spotify-web-api-js'
import { v4 as uuidv4 } from 'uuid'

const Profile = () => {
  const [username, setUsername] = useState('')
  const [profileError, setProfileError] = useState('')
  const [recent, setRecent] = useState([])
  const [artist, setArtist] = useState([])
  const [tracks, setTracks] = useState([])
  const [mode, setMode] = useState('recent')

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
      const { data } = await axios.get('/spotify/recently')
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
      console.log(data)
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

  useEffect(() => {
    recentSongs()
    topAritsts()
    topTracks()
    const intervalID = setInterval(() => {
      recentSongs()
      topAritsts()
      topTracks()
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
