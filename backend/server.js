/* eslint-disable no-console */

const express = require('express')
const cookieSession = require('cookie-session')
const fileUpload = require('express-fileupload')
const path = require('path')
const mongoose = require('mongoose')

// const cors = require('cors')

const http = require('http') // require the vanilla http server
const { Server } = require('socket.io')
const accountRouter = require('./routes/account')
const spotifyRouter = require('./routes/spotify')
const chatRouter = require('./routes/chat')
// const imageRouter = require('./routes/image')

const app = express()
const port = process.env.PORT || 3000
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spoticord'

// mongodb connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// require socket.io
const server = http.createServer(app) // create our server
const io = new Server(server) // create our IO sockets

io.on('connection', socket => {
  console.log(`a user is connected ${socket.id}`)

  // // broadcast user connection
  // socket.broadcast.emit('welcome_message', 'A user has joined the chat!')

  socket.on('join_room', data => {
    socket.join(data)
    console.log(`User with ID: ${socket.id} has joined the room: ${data}`)
  })

  socket.on('send_message', data => {
    console.log(data)
    socket.to(data.chatroom).emit('receive_message', data)
  })

  // boradcast user disconnection
  socket.on('disconnection', () => {
    io.emit('disconnection_message', 'A user has left the chat')
  })
})

app.use(express.static('dist'))
app.use(express.json())
// app.use(cors())

// session
app.use(
  cookieSession({
    name: 'session',
    keys: ['secret-key'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }),
)

app.use(fileUpload())

// routers
app.use('/account', accountRouter)
app.use('/spotify', spotifyRouter)
app.use('/chat', chatRouter)
// app.use('/image', imageRouter)

// default error handling
app.use((err, req, res, next) => {
  res.status(500).send(`There was an error with error message: ${err}!`)
})

app.get('/favicon.ico', (req, res) => {
  res.status(404).send()
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

server.listen(port, () => {
  console.log(`Listening to port: ${port}`)
  console.log(`MongoDB is connected at ${MONGO_URI}`)
})
