const isAuthenticated = (req, res, next) => {
  const { session } = req
  const { username } = session
  if (username) {
    next()
  } else {
    next(new Error(`The user is not logged in!`))
  }
}

module.exports = isAuthenticated
