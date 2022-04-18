import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  Container, Form, Button, Alert,
} from 'react-bootstrap'
import { io } from 'socket.io-client'
import Chat from './Chat'
import NavBar from './NavBar'

const Chatroom = () => {
  const [joinChatroomName, setJoinChatroomName] = useState('')
  const [allChatroomNames, setAllChatroomNames] = useState([])
  const [createChatroomName, setCreateChatroomName] = useState('')
  const [username, setUsername] = useState('')
  const [chatroomError, setChatroomError] = useState('')
  const [chatroomMessage, setChatroomMessage] = useState('')
  const [showChatroom, setShowChatroom] = useState(false)
  const [createChatroomError, setCreateChatroomError] = useState('')

  const socket = io('http://localhost:3000')

  // get user information
  const getUserInformation = async () => {
    try {
      const { data } = await axios.get('/account/user')
      setUsername(data.username)
    } catch (error) {
      setChatroomError('Error getting current user')
    }
  }

  // get the chatrooms
  const gettingChatrooms = async () => {
    try {
      const { data } = await axios.get('/chat/chatrooms')
      setAllChatroomNames(data)
    } catch (error) {
      setCreateChatroomError('error getting chat')
    }
  }

  // create a new chatroom
  const creatingNewChatroom = async () => {
    try {
      await axios.post('/chat/createChatroom', { name: createChatroomName, username })
    } catch (error) {
      setCreateChatroomError('Could not create this chatroom!')
    }
  }

  // add current user to chatroom
  const addingChatMember = async () => {
    try {
      await axios.post('/chat/addChatMember', { username, joinChatroomName })
    } catch (error) {
      setJoinChatroomName('error adding chat member')
    }
  }

  const chatMenuView = () => (
    <Container>
      <NavBar />
      {chatroomError ? <Alert variant="danger">{chatroomError}</Alert> : null}
      <h1>Join a Chatroom!</h1>
      <Form onSubmit={e => e.preventDefault()}>
        <Form.Group className="mb-3" controlId="formBasicJoinChatroomSelect">
          <Form.Label>Select a Chatroom!</Form.Label>
          <Form.Select
            value={joinChatroomName}
            onChange={e => {
              setJoinChatroomName(e.target.value)
            }}
            required
          >
            <option value="">Chatroom</option>
            {allChatroomNames.map(c => <option key={c.name}>{c.name}</option>)}
          </Form.Select>
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          style={{ background: '#1ED760', border: 'none' }}
          onClick={() => {
            socket.emit('join_room', joinChatroomName)
            setShowChatroom(true)
            addingChatMember()
          }}
        >
          Join
        </Button>
      </Form>
      <br />
      <h1>Create a Chatroom!</h1>
      {chatroomMessage ? <Alert variant="success">{chatroomMessage}</Alert> : null}
      <Form onSubmit={e => e.preventDefault()}>
        {createChatroomError ? <Alert variant="danger">{createChatroomError}</Alert> : null}
        <Form.Group className="mb-3" controlId="formBasicCreateChatroomName">
          <Form.Label>Chatroom Name</Form.Label>
          <Form.Control type="text" placeholder="Enter chatroom name" onChange={e => setCreateChatroomName(e.target.value)} />
        </Form.Group>
        <Button
          variant="primary"
          style={{ background: '#1ED760', border: 'none' }}
          type="button"
          onClick={() => {
            creatingNewChatroom()
            setCreateChatroomName('')
            setChatroomMessage('A new room has been created! Please refresh!')
          }}
          disabled={createChatroomName.length === 0}
        >
          Create
        </Button>
      </Form>
      <br />
      <hr />
      <h1>Preview of Chatroom</h1>
    </Container>
  )

  useEffect(() => {
    getUserInformation()
    gettingChatrooms()
  }, [])

  return (
    <>
      {showChatroom ? null : chatMenuView()}
      {<Chat socket={socket} username={username} joinChatroomName={joinChatroomName} showChatroom={showChatroom} />}
    </>
  )
}

export default Chatroom
