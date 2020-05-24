import React from 'react'

import { StyleSheet, css } from 'aphrodite'

import Google from '../_Logos/google.svg'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    margin: '80px 0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    padding: '5px 32px',
    textDecoration: 'none',
    borderRadius: '20px'
  },
  google: {
    color: 'white',
    backgroundColor: '#ea4335',
    ':hover': {
      backgroundColor: '#ec564a',
      cursor: 'pointer'
    }
  },
  loginImage: {
    padding: '10px',
    height: '30px'
  }
})

export default function UnauthenticatedApp () {
  console.log('NOT Auth')
  return (
    <div className={css(styles.container)}>
      <h1>Login To Access The App</h1>
      <div>
        <a
          href='http://localhost:5000/auth/google'
          className={css(styles.loginButtonContainer, styles.google)}
        >
          <img alt='Google' className={css(styles.loginImage)} src={Google} />
          <p>Login with Google</p>
        </a>
      </div>
    </div>
  )
}
