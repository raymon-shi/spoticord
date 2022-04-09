/* eslint-disable no-shadow */
/* eslint-disable no-console */
const express = require('express')
const SpotifyWebApi = require('spotify-web-api-node')

const User = require('../models/user')

const spotifyAPI = new SpotifyWebApi({
  clientId: '121df8c0355f4abca38357af0c39c2c6',
  clientSecret: '0b742a2fd62649ab9db49172e09c6744',
  redirectUri: 'http://localhost:3000/spotify/callback',
})

const scopes = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify',
  'app-remote-control',
  'streaming',

]

const router = express.Router()

router.get('/login', (req, res) => {
  res.send(spotifyAPI.createAuthorizeURL(scopes))
})

router.get('/callback', (req, res) => {
  const { query } = req
  const { error, code, state } = query

  if (error) {
    console.error('Callback Error:', error)
    res.send(`Callback Error: ${error}`)
    return
  }

  spotifyAPI
    .authorizationCodeGrant(code)
    .then(data => {
      const { body } = data
      const { access_token, refresh_token, expires_in } = body

      spotifyAPI.setAccessToken(access_token)
      spotifyAPI.setRefreshToken(refresh_token)

      console.log('access_token:', access_token)
      console.log('refresh_token:', refresh_token)

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`,
      )
      const accessTokenMessage = `Here is the access token! Please copy this and paste it into the login/signup form:

      ${access_token}
      `

      res.send(accessTokenMessage)
      setInterval(async () => {
        const data = await spotifyAPI.refreshAccessToken()
        const { body } = data
        const { access_token } = body

        console.log('The access token has been refreshed!')
        console.log('access_token:', access_token)
        spotifyAPI.setAccessToken(access_token)
      }, (expires_in / 2) * 1000)
    })
    .catch(err => {
      res.send(`Error getting Tokens: ${err}`)
    })
})

router.get('/recently', async (req, res, next) => {
  const { session } = req
  const { token, username } = session
  spotifyAPI.setAccessToken(token)

  try {
    const recentlyPlayed = await spotifyAPI.getMyRecentlyPlayedTracks({ limit: 50 })
    const recentSongs = []
    recentlyPlayed.body.items.forEach((s, index) => {
      recentSongs.push({
        name: s.track.artists[0].name, title: s.track.name, image: s.track.album.images[0].url, played: s.played_at, id: s.track.id + index,
      })
    })
    await User.updateOne({ username }, { recent: recentSongs })
    const user = await User.findOne({ username })
    res.send(user.recent)
  } catch (error) {
    next(new Error('Error inside /recently'))
  }
})

router.get('/myTopArtists', async (req, res, next) => {
  const { session } = req
  const { token, username } = session
  spotifyAPI.setAccessToken(token)

  try {
    const topArtist = await spotifyAPI.getMyTopArtists({ limit: 50 })
    const myTopArtist = []
    topArtist.body.items.forEach((a, index) => {
      myTopArtist.push({
        name: a.name, image: a.images[0].url, genres: a.genres.map(genre => genre[0].toUpperCase() + genre.substring(1).toLowerCase()).join(' | ') || 'no genres listed', id: a.id + index,
      })
    })
    await User.updateOne({ username }, { artists: myTopArtist })
    const user = await User.findOne({ username })
    res.send(user.artists)
  } catch (error) {
    next(new Error('Error inside /myTopArtists'))
  }
})

router.get('/myTopTracks', async (req, res, next) => {
  const { session } = req
  const { token, username } = session
  spotifyAPI.setAccessToken(token)

  try {
    const topTracks = await spotifyAPI.getMyTopTracks({ limit: 50 })
    const myTopTracks = []
    topTracks.body.items.forEach((t, index) => {
      myTopTracks.push({
        name: t.name,
        artist: t.album.artists
          .map(artist => artist.name)
          .join(' | '),
        image: t.album.images[0].url,
        type: t.album.album_type,
        album: t.album.name,
        id: t.id + index,
      })
    })
    console.log(myTopTracks[0].album)
    await User.updateOne({ username }, { tracks: myTopTracks })
    const user = await User.findOne({ username })
    res.send(user.tracks)
  } catch (error) {
    next(new Error('Error inside /myTopTracks'))
  }
})

module.exports = router
