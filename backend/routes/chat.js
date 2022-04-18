const express = require('express')
const User = require('../models/user')
const Chatroom = require('../models/chatroom')
const Message = require('../models/message')

const router = express.Router()

router.get('/chatrooms', async (req, res, next) => {
  try {
    const chatrooms = await Chatroom.find()
    chatrooms.sort((a, b) => a.name.localeCompare(b.name))
    res.send(chatrooms)
  } catch (error) {
    next(new Error('There was an error in /chatrooms'))
  }
})

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

router.post('/chatroomMembers', async (req, res, next) => {
  const { body } = req
  const { name } = body
  try {
    const chatroom = await Chatroom.findOne({ name })
    if (chatroom) {
      const { members } = chatroom
      // members.sort((a, b) => a.name.localeCompare(b.name))
      res.send(members)
    }
  } catch (error) {
    console.log(error)
    next(new Error('There was an error in /chatrooms'))
  }
})

router.post('/addChatMember', async (req, res, next) => {
  const { body } = req
  const { username, joinChatroomName } = body
  try {
    const chatroom = await Chatroom.findOne({ name: joinChatroomName })
    const { members } = chatroom
    console.log(`${members} HELLO MEMBERS`)
    if (!members.includes(username)) {
      const updatedMembers = [...members, username]
      await Chatroom.updateOne({ name: joinChatroomName }, { members: updatedMembers })
      res.send(updatedMembers)
    }
  } catch (error) {
    console.log(error)
    next(new Error('There was an error in /addChatMember'))
  }
})

router.post('/createMessage', async (req, res, next) => {
  const { body } = req
  const {
    sender, message, chatroom, created_at_12hr,
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

router.post('/getMessagesChatroom', async (req, res, next) => {
  const { body } = req
  const { chatroomName } = body
  console.log(chatroomName)
  try {
    const chatroomMessages = await Message.find({ chatroom: chatroomName })
    if (chatroomMessages) {
      chatroomMessages.sort((a, b) => a.created_at - b.created_at)
    }
    console.log(chatroomMessages)
    res.send(chatroomMessages)
  } catch (error) {
    next(new Error('There was an error creating the message'))
  }
})

module.exports = router
