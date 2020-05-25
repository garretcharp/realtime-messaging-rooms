const WebSocket = require('ws')
const Methods = require('./methods')

const {
  normalizePort,
  safeParseJSON,
  generateError,
  checkAuthState,
  broadcast
} = require('../helpers')

const WSS = new WebSocket.Server({
  port: normalizePort(process.env.SOCKET_PORT || 8080)
})

WSS.on('listening', () => {
  console.log(
    `WebSocket Server is now listening on PORT: ${WSS.address().port}`
  )
})

WSS.on('connection', (ws, req) => {
  checkAuthState(req, ({ user, state }) => {
    ws.state = state
    ws.user = user

    if (state === true) {
      ws.send(
        JSON.stringify({
          type: 'auth',
          data: {
            authenticated: true,
            user
          }
        })
      )

      broadcast(
        WSS,
        JSON.stringify({
          type: 'event',
          event: 'UserJoin',
          data: {
            name: user.name,
            picture: user.picture
          }
        }),
        ws
      )
    } else {
      ws.send(
        JSON.stringify({
          type: 'auth',
          data: {
            authenticated: false,
            user: null
          }
        })
      )

      setTimeout(() => ws.close(), 1000)
    }
  })

  ws.on('message', message => {
    const data = safeParseJSON(message)

    if (data === null) {
      ws.send(
        JSON.stringify(
          generateError({
            error: 'Parse Error',
            reasons: [
              {
                reason: 'invalid_message_data',
                message: 'Unable to parse the message contents',
                data: message,
                location: 'websocket-message'
              }
            ]
          })
        )
      )
    } else if (typeof data.method === 'string' && Methods[data.method]) {
      Methods[data.method](WSS, ws, data)
    } else {
      ws.send(
        JSON.stringify(
          generateError({
            error: 'Method Not Found',
            reasons: [
              {
                reason: 'invalid_method',
                message: 'Unable to find matching method',
                data: data.method,
                location: 'method'
              }
            ]
          })
        )
      )
    }
  })
})

module.exports.SocketServer = WSS
