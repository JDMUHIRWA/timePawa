
import { useSession } from '../contexts/SessionContex'



const Homepage = () => {
  const { user, logout } = useSession();

  return (
    <div>
      <h1>Welcome {user?.username || "User"}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
 
export default Homepage