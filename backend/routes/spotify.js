/* eslint-disable no-shadow */
/* eslint-disable no-console */
const express = require('express')
const SpotifyWebApi = require('spotify-web-api-node')

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
      res.redirect(`/?token=${access_token}`)
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

router.post('/recently', async (req, res, next) => {
  const { body } = req
  const { token } = body
  console.log(`${token} @@@ `)
  spotifyAPI.setAccessToken(token)
  const recentlyPlayed = await spotifyAPI.getMyRecentlyPlayedTracks({ limit: 50 })
  const recentSongs = []
  recentlyPlayed.body.items.forEach((s, index) => {
    recentSongs.push({
      name: s.track.artists[0].name, title: s.track.name, image: s.track.album.images[0].url, played: s.played_at, id: s.track.id + index,
    })
  })
  // console.log(recentSongs)
  res.send(recentSongs)
})

module.exports = router
