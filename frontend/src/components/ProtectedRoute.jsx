import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if user is logged in
  const user = localStorage.getItem('user');
  
  // If no user, redirect to signup/login
  if (!user) {
    return <Navigate to="/signup" replace />;
  }
  
  // User is logged in, show the protected content
  return children;
};

export default ProtectedRoute;
