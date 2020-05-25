const express = require('express')
const session = require('express-session')
const app = express()
const routes = require('./routes')

const { generateError, initPassport, parseSession } = require('../helpers')

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})

app.use(parseSession)

initPassport(app)

Object.keys(routes).forEach(key => {
  app.use(`/${key}`, routes[key])
})

app.use((req, res) => {
  return res.status(404).json(
    generateError({
      error: 'Not Found',
      reasons: [
        {
          reason: 'invalid_path',
          message: 'The requested path could not be found',
          data: req.path,
          location: 'path'
        }
      ]
    })
  )
})

const server = app.listen(process.env.WEB_PORT || 5000, () =>
  console.log(
    `Express Server is now listening on PORT: ${server.address().port}`
  )
)
