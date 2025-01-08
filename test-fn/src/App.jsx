import { RouterProvider } from 'react-router-dom'
import Router from './routes'
import { SessionProvider } from './contexts/SessionContex'
import socket from './utils/socket'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    socket.connect()

    // listen for real time events
    socket.on('swap-notification', (data) => {
      console.log('Swap Notification received:', data)
    })

    return () => {
      socket.disconnect()
    }
  }, [])
  return (
    <SessionProvider>
      <RouterProvider router={Router} />
    </SessionProvider>
  )
}

export default App
