import React, { useEffect, useState } from 'react'
import {
  Card, Button, Form, Alert,
} from 'react-bootstrap'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const Chat = ({
  socket, username, joinChatroomName, showChatroom, setShowChatroom,
}) => {
  const [chatMembers, setChatMembers] = useState([])
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [chatError, setChatError] = useState('')
  const [spotifyURI, setSpotifyURI] = useState('')

  const chatroomMembers = async () => {
    try {
      const { data } = await axios.post('/chat/chatroomMembers', { name: joinChatroomName })
      setChatMembers(data)
    } catch (error) {
      setChatError('There was an error getting chat members')
    }
  }

  const gettingArtist = async () => {
    try {
      const { data } = await axios.post('/spotify/searchChatroomArtist', { artist: joinChatroomName })
      setSpotifyURI(data)
    } catch (error) {
      setChatError('There was an error looking up the artist')
    }
  }

  useEffect(() => {
    gettingArtist()
  }, [joinChatroomName])

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
      const { data } = await axios.post('/chat/getMessagesChatroom', { chatroomName: joinChatroomName })
      setMessages(data)
    } catch (error) {
      setChatError('Error getting chat room messages')
    }
  }

  const removingMember = async () => {
    try {
      const { data } = await axios.post('/chat/removeChatMember', { username, joinChatroomName })
      setChatMembers(data)
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
        <Card className="text-center w-25" style={{ height: '100vh' }}>
          <Card.Header style={{ background: '#5865F2', color: 'white' }}>Chat Users</Card.Header>
          <Card.Body>
            {chatMembers.map(n => <p key={n}>{n}</p>)}
          </Card.Body>
          <Card.Footer>
            <Button
              style={{
                background: '#1ED760', border: 'none', position: 'relative',
              }}
              onClick={() => {
                removingMember()
                setShowChatroom(false)
              }}
              disabled={!showChatroom}
            >
              Exit Chat
            </Button>
          </Card.Footer>
        </Card>
        <Card className="text-center w-50" style={{ height: '100vh' }}>
          <Card.Header style={{ background: '#5865F2', color: 'white' }}>{joinChatroomName}</Card.Header>
          <Card.Body>
            {messages.map(m => <p key={uuidv4()} style={{ textAlign: 'left' }}>{`(${new Date(m.created_at).toLocaleTimeString([], { hour: 'numeric', hour12: true, minute: 'numeric' })}) ${m.sender}: ${m.message}`}</p>)}
          </Card.Body>
          <Card.Footer className="text-muted">
            <Form onSubmit={e => {
              e.preventDefault()
              e.target.reset()
            }}
            >
              <Form.Control type="text" id="message-input" placeholder="Type a message..." onChange={e => setMessage(e.target.value)} />
              <Button
                disabled={message.length === 0}
                onClick={() => {
                  sendingMessage()
                  setMessage('')
                }}
                className="w-75"
                type="submit"
                style={{ background: '#1ED760', border: 'none' }}
              >
                Send Message
              </Button>
            </Form>

          </Card.Footer>
        </Card>
        <Card className="text-center w-25" style={{ height: '100vh' }}>
          <Card.Header style={{ background: '#5865F2', color: 'white' }}>Spotify Player</Card.Header>
          <iframe title="Spotify-Player" src={`https://embed.spotify.com/?uri=${spotifyURI}`} style={{ height: '100vh' }} frameBorder="5" />
        </Card>

      </div>
    </>

  )
}

export default Chat
