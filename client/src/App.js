import React from 'react'
import { AuthProvider, useAuthState } from './_Contexts/auth'

import Loader from './_Components/Loader'

const AuthenticatedApp = React.lazy(() => import('./Authenticated'))
const UnauthenticatedApp = React.lazy(() => import('./Unauthenticated'))

function AppComponent () {
  const { isAuthenticated } = useAuthState()

  return (
    <React.Suspense fallback={<Loader />}>
      {isAuthenticated === true ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  )
}

function App () {
  return (
    <AuthProvider>
      <AppComponent />
    </AuthProvider>
  )
}

export default App
