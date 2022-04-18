const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const { Schema, model } = mongoose

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  bio: { type: String, required: true },
  birthday: { type: String, required: true },
  location: { type: String, required: true },
  token: { type: String, required: true },
  image: { type: String, required: true },
  recent: { type: [] },
  tracks: { type: [] },
  artists: { type: [] },
  playlists: { type: [] },
  created_on: Date,
})

// eslint-disable-next-line func-names
userSchema.pre('save', async function (next) {
  try {
    const passwordSalt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, passwordSalt)
    this.password = hashedPassword
  } catch (error) {
    next(new Error(`There was an error in hashing the password with error message ${error}`))
  }
})

const User = model('User', userSchema)

module.exports = User
