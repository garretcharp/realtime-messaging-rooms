import React from 'react'
import Loader from '../_Components/Loader'

const AuthContext = React.createContext()

const getUser = async () => {
  try {
    const response = await fetch('http://localhost:5000/auth/current', {
      credentials: 'include',
      mode: 'cors'
    })
    const data = await response.json()

    return Promise.resolve(data.user)
  } catch (error) {
    return Promise.reject(error)
  }
}

function LoadError () {
  return <p>Internal Server Error</p>
}

function AuthProvider ({ children }) {
  const [state, setState] = React.useState({
    status: 'loading',
    error: null,
    user: null
  })

  React.useEffect(() => {
    getUser()
      .then(user => setState({ status: 'success', error: null, user }))
      .catch(error => setState({ status: 'error', error, user: null }))
  }, [])

  return (
    <AuthContext.Provider value={state}>
      {state.status === 'loading' && <Loader />}

      {state.status === 'success' && children}

      {state.status === 'error' && <LoadError />}
    </AuthContext.Provider>
  )
}

function useAuthState () {
  const state = React.useContext(AuthContext)

  const isPending = state.status === 'pending'
  const isError = state.status === 'error'
  const isSuccess = state.status === 'success'
  const isAuthenticated = state.user && isSuccess
  return {
    ...state,
    isPending,
    isError,
    isSuccess,
    isAuthenticated
  }
}

export { AuthProvider, useAuthState }
