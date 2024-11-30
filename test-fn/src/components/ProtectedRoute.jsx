import {Navigate, Outlet } from 'react-router-dom';
import { useSession } from '../contexts/SessionContex';
// import { useSession } from '../contexts/SessionContex';


const ProtectedRoute = () => {
  const {loggedIn, loading} = useSession();
  console.log("The logged in user is:", loggedIn)
  if (loading) {
    return <div>Loading...</div>;
  }
  return loggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute