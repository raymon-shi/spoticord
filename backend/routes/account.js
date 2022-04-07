const express = require('express')
const bcrypt = require('bcrypt')

const User = require('../models/user')
const isAuthenticated = require('../middleware/isAuthenticated')

const router = express.Router()

// creates a new user with username and password
router.post('/signup', async (req, res, next) => {
  const { body } = req
  const { username, password } = body
  try {
    const createdUser = await User.create({
      username, password, tracks: [], artists: [], genres: [], chats: [],
    })
    res.send(createdUser)
  } catch (error) {
    next(new Error(`Error inside /signup with error message: ${error}`))
  }
})

// logs a user in if they exists
router.post('/login', async (req, res, next) => {
  const { body } = req
  const { username, password } = body
  try {
    const user = await User.findOne({ username })
    const match = await bcrypt.compare(password, user.password)
    if (match) {
      req.session.username = username
      res.send(user)
    } else {
      next(new Error('The user does not exists or the password may be incorrect!'))
    }
  } catch (error) {
    next(new Error(`Error inside /login with error message: ${error}`))
  }
})

// logs a user out if they are logged in
router.post('/logout', isAuthenticated, (req, res, next) => {
  const { session } = req
  const { username } = session
  req.session.username = undefined
  res.send(`The user with username "${username}" has been logged out!`)
})

// get user information
router.get('/user', (req, res, next) => {
  const { session } = req
  const { username } = session
  res.send({ username })
})

module.exports = router
