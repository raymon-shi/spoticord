const isAuthenticated = (req, res, next) => {
  const { session } = req
  const { username, token } = session
  if (username && token) {
    next()
  } else {
    next(new Error(`The user is not logged in!`))
  }
}

module.exports = isAuthenticated
