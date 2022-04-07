/* eslint-disable no-console */

const express = require('express')
const cookieSession = require('cookie-session')
const path = require('path')
const mongoose = require('mongoose')

// const isAuthenticated = require('./middlewares/isAuthenticated')
// const accountRouter = require('./routes/account')
// const apiRouter = require('./routes/api')

const app = express()
const port = process.env.PORT || 3000
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spoticord'

// mongodb connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.use(express.static('dist'))
app.use(express.json())

// session
app.use(
  cookieSession({
    name: 'session',
    keys: ['secret-key'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }),
)

// routers
// app.use('/account', accountRouter)
// app.use('/api', apiRouter)

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

app.listen(port, () => {
  console.log(`Listening to port: ${port}`)
  console.log(`MongoDB is connected at ${MONGO_URI}`)
})
