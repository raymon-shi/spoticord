// const express = require('express')

// const path = require('path')

// const router = express.Router()

// router.post('/upload', (req, res, next) => {
//   if (req.files) {
//     const { files } = req
//     const { file } = files
//     try {
//       file.mv(path.join(`${__dirname}`, '..', '..', 'frontend', 'src', 'assets', 'uploads', `${file.name}`))

//       res.send({ name: file.name, path: path.join(`${__dirname}`, '..', '..', 'frontend', 'src', 'assets', 'uploads', `${file.name}`) })
//     } catch (error) {
//       console.log(error)
//       next(new Error('Error in /upload'))
//     }
//   }
// })

// module.exports = router
