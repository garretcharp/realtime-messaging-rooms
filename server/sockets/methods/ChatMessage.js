const { broadcast } = require('../../helpers')

module.exports = (wss, ws, { arguments, id, ...rest }) => {
  if (!Array.isArray(arguments) || !typeof id === 'number') {
    ws.send(
      JSON.stringify({
        type: 'reply',
        error: 'INVALID',
        data: { arguments, id, ...rest }
      })
    )
  } else {
    const message = arguments[0]

    ws.send(
      JSON.stringify({
        type: 'reply',
        reply: 'ChatMessage',
        error: null,
        data: { message: message }
      })
    )

    broadcast(
      wss,
      JSON.stringify({
        type: 'event',
        event: 'ChatMessage',
        data: { message: message, name: ws.user.name }
      }),
      ws
    )
  }
}
