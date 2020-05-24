import React from 'react'
import { useAuthState } from '../_Contexts/auth'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    margin: '80px 0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileImage: {
    padding: '10px',
    height: '200px',
    borderRadius: '50%'
  },
  logoutButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    padding: '5px 32px',
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

export default function UnauthenticatedApp () {
  const { user } = useAuthState()
  return (
    <div className={css(styles.container)}>
      <h1>Welcome {user.name}</h1>
      <div>
        <img
          className={css(styles.profileImage)}
          alt='Profile'
          src={user.picture}
        />
      </div>
      <div>
        <a
          className={css(styles.logoutButtonContainer)}
          href='http://localhost:5000/auth/logout'
        >
          Logout
        </a>
      </div>
    </div>
  )
}
