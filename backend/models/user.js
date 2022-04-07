const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tracks: { type: [] },
  artists: { type: [] },
  genres: { type: [] },
  chats: { type: [] },
})

const User = model('User', userSchema)

module.exports = User
