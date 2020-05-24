import React from 'react'

export default function UnauthenticatedApp () {
  console.log('NOT Auth')
  return (
    <div>
      <h1>Hello there</h1>
      <p>Welcome to my app... (Auth false)</p>
    </div>
  )
}
