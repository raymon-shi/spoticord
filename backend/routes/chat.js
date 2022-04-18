const express = require('express')
const Chatroom = require('../models/chatroom')
const Message = require('../models/message')

const router = express.Router()

// get the list of chatrooms
router.get('/chatrooms', async (req, res, next) => {
  try {
    const chatrooms = await Chatroom.find()
    chatrooms.sort((a, b) => a.name.localeCompare(b.name))
    res.send(chatrooms)
  } catch (error) {
    next(new Error('There was an error in /chatrooms'))
  }
})

// adds a chatroom to database
router.post('/createChatroom', async (req, res, next) => {
  const { body, session } = req
  const { name } = body
  const { username } = session

  try {
    await Chatroom.create({ name, members: [username] })
  } catch (error) {
    next(new Error('There was an error creating chatrooms'))
  }
})

// finds the members of the chatroom
router.post('/chatroomMembers', async (req, res, next) => {
  const { body } = req
  const { name } = body
  try {
    const chatroom = await Chatroom.findOne({ name })
    if (chatroom) {
      const { members } = chatroom
      res.send(members)
    }
  } catch (error) {
    next(new Error('There was an error in /chatrooms'))
  }
})

// adds the person to the chat room
router.post('/addChatMember', async (req, res, next) => {
  const { body } = req
  const { username, joinChatroomName } = body
  try {
    const chatroom = await Chatroom.findOne({ name: joinChatroomName })
    const { members } = chatroom
    if (!members.includes(username)) {
      const updatedMembers = [...members, username]
      await Chatroom.updateOne({ name: joinChatroomName }, { members: updatedMembers })
      res.send(updatedMembers)
    }
  } catch (error) {
    next(new Error('There was an error in /addChatMember'))
  }
})

// adds the message to the database
router.post('/createMessage', async (req, res, next) => {
  const { body } = req
  const {
    sender, message, chatroom,
  } = body

  try {
    await Message.create({
      sender, message, chatroom, created_at: new Date(),
    })
    res.send('Message was created')
  } catch (error) {
    next(new Error('There was an error creating the message'))
  }
})

// get all the messages in the chatroom
router.post('/getMessagesChatroom', async (req, res, next) => {
  const { body } = req
  const { chatroomName } = body
  try {
    const chatroomMessages = await Message.find({ chatroom: chatroomName })
    if (chatroomMessages) {
      chatroomMessages.sort((a, b) => a.created_at - b.created_at)
    }
    res.send(chatroomMessages)
  } catch (error) {
    next(new Error('There was an error creating the message'))
  }
})

module.exports = router
