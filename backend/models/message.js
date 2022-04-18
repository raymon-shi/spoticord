const mongoose = require('mongoose')

const { Schema, model } = mongoose

const messageSchema = new Schema({
  sender: { type: String, required: true },
  message: { type: String, required: true },
  chatroom: { type: String, required: true },
  created_at: { type: Date, required: true },
})

const Message = model('Message', messageSchema)

module.exports = Message
