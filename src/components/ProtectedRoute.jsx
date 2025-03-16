import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
