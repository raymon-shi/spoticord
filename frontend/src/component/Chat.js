import React, { useEffect, useState } from 'react'
import { Card, Button, Form } from 'react-bootstrap'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const Chat = ({
  socket, username, joinChatroomName, showChatroom,
}) => {
  const [chatMembers, setChatMembers] = useState([])
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [chatError, setChatError] = useState('')

  const chatroomMembers = async () => {
    try {
      const { data } = await axios.post('/chat/chatroomMembers', { name: joinChatroomName })
      setChatMembers(data)
    } catch (error) {
      setChatError('There was an error getting chat members')
    }
  }

  const sendingMessage = async () => {
    const messageInformation = {
      sender: username,
      message,
      chatroom: joinChatroomName,
      created_at: new Date().toLocaleTimeString([], { hour: 'numeric', hour12: true, minute: 'numeric' }),
    }
    try {
      await socket.emit('send_message', messageInformation)
      await axios.post('/chat/createMessage', { sender: messageInformation.sender, message: messageInformation.message, chatroom: messageInformation.chatroom })
    } catch (error) {
      setChatError('Error sending message')
    }
  }

  useEffect(() => {
    chatroomMembers()
    const intervalID = setInterval(() => {
      chatroomMembers()
    }, 5000)
    return () => clearInterval(intervalID)
  }, [joinChatroomName])

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (showChatroom) {
      chatroomMembers()
      const intervalID = setInterval(() => {
        chatroomMembers()
      }, 2000)
      return () => clearInterval(intervalID)
    }
  }, [])

  const getChatRoomMessages = async () => {
    try {
      console.log(`${joinChatroomName} HERE CONSOLE LOSG`)
      const { data } = await axios.post('/chat/getMessagesChatroom', { chatroomName: joinChatroomName })
      setMessages(data)
    } catch (error) {
      setChatError('Error getting chat room messages')
    }
  }

  useEffect(() => {
    getChatRoomMessages()
    const intervalID = setInterval(() => {
      getChatRoomMessages()
    }, 2000)
    return () => clearInterval(intervalID)
  }, [joinChatroomName])

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Card className="text-center w-25 mx-auto" style={{ height: '50vh' }}>
          {chatMembers.map(n => <p key={n}>{n}</p>)}
        </Card>
        <Card className="text-center w-50 mx-auto" style={{ height: '50vh' }}>
          <Card.Header>{joinChatroomName}</Card.Header>
          <Card.Body>
            {messages.map(m => <p key={uuidv4()}>{`(${new Date(m.created_at).toLocaleTimeString([], { hour: 'numeric', hour12: true, minute: 'numeric' })}) ${m.sender}: ${m.message}`}</p>)}
          </Card.Body>
          <Card.Footer className="text-muted">
            <Form.Control type="text" id="message-input" placeholder="Type a message..." onChange={e => setMessage(e.target.value)} />
            <Button
              disabled={message.length === 0}
              onClick={() => {
                sendingMessage()
                setMessage('')
              }}
              className="w-75"
            >
              Send Message
            </Button>
          </Card.Footer>
        </Card>
      </div>

    </>

  )
}

export default Chat
