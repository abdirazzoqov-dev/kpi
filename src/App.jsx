import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import TableComponent from "./components/TableComponent";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    return (
        <Router>
            <AppContent user={user} setUser={setUser} />
        </Router>
    );
}

function AppContent({ user, setUser }) {
    const location = useLocation(); // Get current route

    const hideNavbarRoutes = ["/", "/login"]; // Routes where Navbar should be hidden
    const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

    return (
        <>
            {shouldShowNavbar && <Navbar user={user} setUser={setUser} />}
            <div>
                <Routes>
                    <Route path="/" element={<Login setUser={setUser} />} />
                    <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/kpi" element={<ProtectedRoute element={<TableComponent />} />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
