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
      (request, accessToken, refreshToken, profile, done) => {
        return done(null, profile._json)
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user)
  })

  passport.deserializeUser((user, done) => {
    done(null, user)
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
    console.log(req.session)

    if (!req.session) {
      cb({ user: null, state: false })
    } else {
      const user = req.session.passport
        ? req.session.passport.user
        : req.session.passport
      const state = !!user

      cb({ user, state })
      console.log({
        user,
        state
      })
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
