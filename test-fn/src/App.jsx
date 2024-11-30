import { RouterProvider } from 'react-router-dom'
import Router from './routes'
import { SessionProvider } from './contexts/SessionContex'

function App() {
  return (
    <SessionProvider>
      <RouterProvider router={Router} />
    </SessionProvider>
  )
}

export default App
