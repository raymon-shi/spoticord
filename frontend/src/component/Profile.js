import axios from 'axios'
import { Alert } from 'bootstrap'
import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'

const Profile = () => {
  const [username, setUsername] = useState('')
  const [profileError, setProfileError] = useState('')

  const gettingUserInformation = async () => {
    try {
      const { data } = await axios.get('/account/user')
      if (data.username) {
        setUsername(data.username)
      }
    } catch (error) {
      setProfileError('There was an error trying to get the user information!')
    }
  }

  useEffect(() => {
    gettingUserInformation()
  }, [])

  return (
    <Container>
      {profileError ? <Alert variant="danger">{profileError}</Alert> : null}
      <h1>
        Welcome to Spoticord,
        {' '}
        {username}
      </h1>
    </Container>
  )
}

export default Profile
