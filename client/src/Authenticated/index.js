import React from 'react'
import { useAuthState } from '../_Contexts/auth'
import { StyleSheet, css } from 'aphrodite'

import Loader from '../_Components/Loader'

const UnauthenticatedApp = React.lazy(() => import('../Unauthenticated')) // incase of lost auth

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    margin: '30px 0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '50px'
  },
  profileImage: {
    padding: '10px',
    marginRight: '12px',
    height: '100px',
    borderRadius: '50%'
  },
  profileDetails: {
    display: 'flex',
    flexDirection: 'column'
  },
  profileName: {
    padding: '0',
    margin: '0'
  },
  logoutButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    padding: '5px 12px',
    textDecoration: 'none',
    color: 'white',
    backgroundColor: '#ea4335',
    ':hover': {
      backgroundColor: '#ec564a',
      cursor: 'pointer'
    },
    borderRadius: '20px'
  }
})

export default function AuthenticatedApp () {
  const { user } = useAuthState()

  const Socket = React.useRef()
  const [authenticated, setAuthenticated] = React.useState(true)
  const [messages, setMessages] = React.useState([])
  const [retryingIn, setRetryingIn] = React.useState(0)

  React.useEffect(() => {
    console.log('useEffect')
    let retryLength = 1,
      reconnect = true

    const createSocket = () => {
      console.log('Create socket')

      Socket.current = new WebSocket('ws://localhost:8080')

      Socket.current.onmessage = message => {
        try {
          const data = JSON.parse(message.data)

          if (data.type === 'reply') {
            console.log('reply data', data)

            if (data.reply === 'ChatMessage') {
              setMessages(prev => [
                ...prev,
                `${user.name} (you): ${data.data.message}`
              ])
            }
          } else if (data.type === 'event') {
            console.log('event data', data)
            if (data.event === 'UserJoin') {
              setMessages(prev => [
                ...prev,
                `${data.data.name} has joined the chat.`
              ])
            } else if (data.event === 'ChatMessage') {
              setMessages(prev => [
                ...prev,
                `${data.data.name}: ${data.data.message}`
              ])
            }
          } else if (data.type === 'auth') {
            console.log('auth data', data)
            if (data.data.authenticated !== true) {
              console.log('NO AUTH!!!')
              reconnect = false
              setAuthenticated(false)
            } else {
              console.log('Auth!!!')
            }
          } else {
            console.log('unknown data', data)
          }
        } catch (error) {
          console.error('ERROR')
          console.error(error)
        }
      }

      Socket.current.onopen = () => {
        console.log('Open')

        retryLength = 1
      }

      Socket.current.onclose = () => {
        if (!reconnect) return

        console.log({ reconnect })

        if (retryLength < 10) {
          retryLength = Math.ceil(retryLength * 1.5)
        }

        setRetryingIn(retryLength)

        const int = setInterval(() => {
          setRetryingIn(prev => prev - 1)
        }, 1000)

        setTimeout(() => {
          if (reconnect) {
            createSocket()
          }

          clearInterval(int)
          setRetryingIn(0)
        }, 1000 * retryLength)
      }

      Socket.current.onerror = error => {
        console.error('error', error)
      }
    }

    createSocket()

    return () => {
      reconnect = false

      if (Socket.current && Socket.current.readyState === WebSocket.OPEN) {
        Socket.current.close()
      }
    }
  }, [user])

  const sendMessage = message => {
    if (Socket.current && Socket.current.readyState === WebSocket.OPEN) {
      Socket.current.send(
        JSON.stringify({ method: 'ChatMessage', id: 0, arguments: [message] })
      )
    } else {
      // send error message to client
    }
  }

  if (authenticated === false) {
    return (
      <React.Suspense fallback={<Loader />}>
        <div className={css(styles.container)}>
          <p>Oops, you lost authentication!</p>
        </div>
        <UnauthenticatedApp />
      </React.Suspense>
    )
  }

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.profileCard)}>
        <img
          className={css(styles.profileImage)}
          alt='Profile'
          src={user.picture}
        />
        <div className={css(styles.profileDetails)}>
          <h1 className={css(styles.profileName)}>{user.name}</h1>
          <a
            className={css(styles.logoutButtonContainer)}
            href='http://localhost:5000/auth/logout'
          >
            Logout
          </a>
        </div>
      </div>
      {retryingIn !== 0 && (
        <p>Oops We lost connection... (Retrying in {retryingIn})</p>
      )}
      <div>
        {messages.map((message, index) => {
          return <p key={index}>{message}</p>
        })}
      </div>
      <input
        type='text'
        minLength={1}
        maxLength={360}
        onKeyPress={e => {
          if (e.keyCode === 13 || e.key === 'Enter') {
            sendMessage(e.target.value)
            e.target.value = ''
          }
        }}
      />
    </div>
  )
}
