import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, user }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = user || storedUser; // App dan kelgan user birinchi o‘rin, keyin localStorage
  return currentUser ? <Component user={currentUser} /> : <Navigate to="/" />;
};

export default ProtectedRoute;