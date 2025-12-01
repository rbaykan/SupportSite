import { Outlet, Navigate } from 'react-router-dom'

const ProtectedPages = ({ isLogin, isLoading }) => {
  console.log("ProtectedPages - isLogin:", isLogin, "isLoading:", isLoading);
  

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return isLogin ? <Outlet/> : <Navigate to="/login"/>
}

export default ProtectedPages;