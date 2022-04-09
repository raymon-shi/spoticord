const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const { Schema, model } = mongoose

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, required: true },
  recent: { type: [] },
  tracks: { type: [] },
  artists: { type: [] },
  genres: { type: [] },
  chats: { type: [] },
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
