import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import TableComponent from "./components/TableComponent";
import ProtectedRoute from "./components/ProtectedRoute";
import Report from "./components/Report";
import UserSettings from "./components/UserSettings";
import VisualReport from "./components/VisualReport";

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
  const location = useLocation();
  const hideNavbarRoutes = ["/", "/login"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar user={user} setUser={setUser} />}
      <div>
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/kpi" element={<ProtectedRoute element={TableComponent} user={user} />} />
          <Route path="/reports" element={<ProtectedRoute element={Report} user={user} />} />
          <Route path="/visual-report" element={<ProtectedRoute element={VisualReport} user={user} />} />
          <Route path="/settings" element={<ProtectedRoute element={UserSettings} user={user} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;