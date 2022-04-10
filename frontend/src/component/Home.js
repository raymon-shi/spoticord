/* eslint-disable global-require */
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Container, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Home = () => {
  const [username, setUsername] = useState('')
  const [users, setUsers] = useState([])
  const [homeError, setHomeError] = useState('')

  const getUsers = async () => {
    try {
      const { data } = await axios.get('/account/users')
      setUsers(data)
    } catch (error) {
      setHomeError('Error getting users')
    }
  }

  const getUser = async () => {
    try {
      const { data } = await axios.get('/account/user')
      setUsername(data.username)
    } catch (error) {
      setHomeError('Error getting users')
    }
  }

  useEffect(() => {
    getUsers()
    getUser()
    const intervalID = setInterval(() => {
      getUsers()
    }, 50000)
    return () => clearInterval(intervalID)
  }, [])

  return (
    <Container>
      <h1>{`Welcome to Spoticord, ${username}`}</h1>
      <h2>List of Users</h2>
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
                  <td><Link to={`/profile/${u._id}`} state={{ currentUser: username }}>{u.username}</Link></td>
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
