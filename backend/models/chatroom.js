const mongoose = require('mongoose')

const { Schema, model } = mongoose

const chatroomSchema = new Schema({
  name: { type: String, required: true, unique: true },
  members: { type: [], required: true },
})

const Chatroom = model('Chatroom', chatroomSchema)

module.exports = Chatroom
