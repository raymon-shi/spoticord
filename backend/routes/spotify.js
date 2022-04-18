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

// get the top artists and update the database
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

// get the top tracks and update the database
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
    await User.updateOne({ username }, { tracks: myTopTracks })
    const user = await User.findOne({ username })
    res.send(user.tracks)
  } catch (error) {
    console.log(error)
    next(new Error('Error inside /myTopTracks'))
  }
})

// send the uri of the artists based on chatroom name
router.post('/searchChatroomArtist', async (req, res, next) => {
  const { body, session } = req
  const { artist } = body
  const { token } = session

  spotifyAPI.setAccessToken(token)

  try {
    const artistResults = await spotifyAPI.searchArtists(artist)
    res.send(artistResults.body.artists.items[0].uri)
  } catch (error) {
    next(new Error('Error searching up artist'))
  }
})

// get the playlists and update the database
router.get('/getPlaylist', async (req, res, next) => {
  const { session } = req
  const { token, username } = session
  spotifyAPI.setAccessToken(token)
  try {
    const data = await spotifyAPI.getMe()
    const { body } = data
    const { id } = body
    const playlists = await spotifyAPI.getUserPlaylists({ id, limit: 50 })
    const playlistInfo = []
    playlists.body.items.forEach((playlist, index) => {
      playlistInfo.push({
        playlistName: playlist.name, playlistImage: playlist.images[0].url, playlistTrackTotal: playlist.tracks.total, playlistLink: playlist.external_urls.spotify, id: index,
      })
    })
    await User.updateOne({ username }, { playlists: playlistInfo })
    const user = await User.findOne({ username })
    res.send(user.playlists)
  } catch (error) {
    next(new Error('Error in getMe'))
  }
})

module.exports = router
