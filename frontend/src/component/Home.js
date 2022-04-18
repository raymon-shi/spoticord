/* eslint-disable global-require */
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Container, Table } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'

const Home = () => {
  const [username, setUsername] = useState('')
  const [id, setID] = useState('')
  const [users, setUsers] = useState([])
  const [homeError, setHomeError] = useState('')

  const navigate = useNavigate()

  // get the current user information
  const getUser = async () => {
    try {
      const { data } = await axios.get('/account/user')
      setUsername(data.username)
      setID(data.id)
    } catch (error) {
      setHomeError('Error getting users')
    }
  }

  // get all the users in the database
  const getUsers = async () => {
    try {
      const { data } = await axios.get('/account/users')
      setUsers(data)
    } catch (error) {
      setHomeError('Error getting users')
    }
  }

  // get the user once on refresh
  useEffect(() => {
    getUser()
  }, [])

  // get the users every 5 seconds
  useEffect(() => {
    getUsers()
    const intervalID = setInterval(() => {
      getUsers()
    }, 5000)
    return () => clearInterval(intervalID)
  }, [])

  return (
    <Container>
      <NavBar username={username} />
      <h1>{`Welcome to Spoticord, ${username}`}</h1>
      <h2>Join a Chatroom</h2>
      <Button onClick={() => navigate('/chatroom')}>Chatrooms</Button>
      <h2>List of Users</h2>
      {/* <button type="button" onClick={logout}>Logout</button> */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Profile Picture</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => {
            const { image } = u
            return (
              <tr key={u._id}>
                <>
                  <td>{index + 1}</td>
                  <td><img src={image} width="100px" height="100px" alt="" /></td>
                  <td><Link to={`/profile/${username}/${u.username}`}>{u.username}</Link></td>
                </>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </Container>
  )
}

export default Home
