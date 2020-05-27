module.exports.to = promise =>
  promise.then(results => [null, results]).catch(error => [error, null])

/**
 * @param {string | number} PORT The port to listen on.
 * @return {number} The normalized port number.
 */

module.exports.normalizePort = PORT => {
  if (isNaN(Number(PORT))) PORT = 8080

  return PORT
}

/**
 * @param {string} message The message to parse.
 * @return The parsed JSON object or null.
 */

module.exports.safeParseJSON = message => {
  try {
    return JSON.parse(message)
  } catch (error) {
    return null
  }
}

/**
 * @typedef ErrorReason
 * @type {Object}
 * @param {string} reason - The reason for the error
 * @param {string} message - The error reason message
 * @param {any} data - The data received at the location of the error.
 * @param {string} location - The location of the error reason.
 */

/**
 * @typedef ErrorMessage
 * @type {Object}
 * @param {string} error - The error message.
 * @param {Array.<ErrorReason>} reasons - The reasons for the error.
 */

/**
 * @param {ErrorMessage}
 * @return The rendered error message
 */
module.exports.generateError = ({ error, reasons = [] }) => {
  return {
    type: 'error',
    message: error,
    code: error
      .split(' ')
      .join('_')
      .toLowerCase(),
    context_info: {
      errors: reasons.map(({ reason, message, data, location }) => {
        return {
          reason,
          message,
          data: data || null,
          location
        }
      })
    }
  }
}

/**
 * Auth
 */
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy
const User = require('../entities/users')
const {
  DynamoDB: { DocumentClient }
} = require('aws-sdk')

const DynamoClient = new DocumentClient({
  credentials: {
    accessKeyId: process.env.DYNAMO_ACCESS_KEY,
    secretAccessKey: process.env.DYNAMO_ACCESS_SECRET
  },
  region: process.env.DYNAMO_REGION,
  endpoint: process.env.DYNAMO_ENDPOINT
})

module.exports.initPassport = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/auth/google/callback',
        passReqToCallback: true
      },
      async (request, accessToken, refreshToken, profile, done) => {
        if (!profile._json.email) return done(new Error('Missing email'), null)

        const user = new User({
          id: profile._json.sub,
          name: profile._json.name,
          picture: profile._json.picture,
          email: profile._json.email
        })

        const [error, response] = await this.to(
          DynamoClient.put({
            TableName: process.env.DYNAMO_TABLE_NAME,
            Item: user.toItem()
          }).promise()
        )

        return done(error, error ? null : user.toItem())
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.PK)
  })

  passport.deserializeUser(async (user, done) => {
    const [error, response] = await this.to(
      DynamoClient.get({
        TableName: process.env.DYNAMO_TABLE_NAME,
        Key: {
          PK: user,
          SK: user
        }
      }).promise()
    )

    done(error, response ? User.toObject(response.Item) : null)
  })
}

/**
 * Sessions/Server (WS & Express)
 */
const expressSessions = require('express-session')

module.exports.parseSession = expressSessions({
  secret: 'something_secret',
  resave: false,
  saveUninitialized: false
})

module.exports.checkAuthState = (req, cb = () => {}) => {
  this.parseSession(req, {}, () => {
    if (!req.session) {
      cb({ user: null, state: false })
    } else {
      const user = req.session.passport
        ? req.session.passport.user
        : req.session.passport
      const state = !!user

      cb({ user, state })
    }
  })
}

module.exports.broadcast = (wss, message, excludedClient) => {
  wss.clients.forEach(client => {
    if (client.state && client !== excludedClient) {
      client.send(message)
    }
  })
}
