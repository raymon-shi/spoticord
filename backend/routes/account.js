const express = require('express')
const bcrypt = require('bcrypt')

const User = require('../models/user')
const isAuthenticated = require('../middleware/isAuthenticated')

const router = express.Router()

// creates a new user with username and password
router.post('/signup', async (req, res, next) => {
  const { body } = req
  const {
    username, password, image, token, fullname, bio, birthday, location,
  } = body
  try {
    const createdUser = await User.create({
      username, password, fullname, bio, birthday, location, image, token, tracks: [], artists: [], genres: [], chats: [], created_on: new Date(),
    })
    res.send(createdUser)
  } catch (error) {
    next(new Error(`Error inside /signup with error message: ${error}`))
  }
})

// logs a user in if they exists
router.post('/login', async (req, res, next) => {
  const { body } = req
  const {
    username, password, token,
  } = body
  try {
    const user = await User.findOne({ username })
    // const { _id } = user
    const matchPassword = await bcrypt.compare(password, user.password)
    if (matchPassword) {
      req.session.username = username
      req.session.token = token
      const { _id } = user
      req.session.id = _id
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

// get all users
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find()
    res.send(users)
  } catch (error) {
    next(new Error('Error inside /users'))
  }
})

router.post('/profile', async (req, res, next) => {
  const { body } = req
  const { _id } = body
  try {
    const user = await User.findById({ _id })
    const {
      username, image, recent, tracks, artists, genres, created_on, fullname, bio, birthday, location,
    } = user

    res.send({
      username, image, recent, tracks, artists, genres, created_on, fullname, bio, birthday, location,
    })
  } catch (error) {
    next(new Error('There was an error in /profile'))
  }
})

module.exports = router
