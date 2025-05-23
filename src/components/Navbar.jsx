import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, role, setIsAuthenticated, setRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginSuccess");
    setIsAuthenticated(false);
    setRole(null);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary-dark px-4">
      <img src="/AppVLE_logo.png" alt="AppVLE Logo" width="40" height="40" className="me-2" />
      <Link className="navbar-brand" to="/dashboard">AppVLE</Link>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          {isAuthenticated && (
            <>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} to="/dashboard">Dashboard</Link>
              </li>

              {role === "student" && (
                <>
                  <li className="nav-item"><Link className={`nav-link ${location.pathname === '/register-course' ? 'active' : ''}`} to="/register-course">Course Registration</Link></li>
                  <li className="nav-item"><Link className={`nav-link ${location.pathname === '/courses-list' ? 'active' : ''}`} to="/courses-list">Courses List</Link></li>
                  <li className="nav-item"><Link className={`nav-link ${location.pathname === '/my-courses' ? 'active' : ''}`} to="/my-courses">My Courses</Link></li>
                  <li className="nav-item"><Link className={`nav-link ${location.pathname === '/my-events' ? 'active' : ''}`} to="/my-events">My Events</Link></li>
                  <li className="nav-item"><Link className={`nav-link ${location.pathname === '/my-final-average' ? 'active' : ''}`} to="/my-final-average">View Final Average</Link></li>
                </>
              )}

              {role === "lecturer" && (
                <li className="nav-item"><Link className={`nav-link ${location.pathname === '/my-courses' ? 'active' : ''}`} to="/my-courses">My Courses</Link></li>
              )}

              {role === "admin" && (
                <>
                  <li className="nav-item"><Link className={`nav-link ${location.pathname === '/create-course' ? 'active' : ''}`} to="/create-course">Create Course</Link></li>
                  <li className="nav-item"><Link className={`nav-link ${location.pathname === '/courses-list' ? 'active' : ''}`} to="/courses-list">Courses List</Link></li>
                  <li className="nav-item"><Link className={`nav-link ${location.pathname === '/student-courses' ? 'active' : ''}`} to="/student-courses">Student Courses</Link></li>
                  <li className="nav-item"><Link className={`nav-link ${location.pathname === '/lecturer-courses' ? 'active' : ''}`} to="/lecturer-courses">Lecturer Courses</Link></li>
                  <li className="nav-item"><Link className={`nav-link ${location.pathname === '/reports' ? 'active' : ''}`} to="/reports">View Reports</Link></li>
                </>
              )}
            </>
          )}

          {!isAuthenticated && (
            <>
              <li className="nav-item"><Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Login</Link></li>
              <li className="nav-item"><Link className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`} to="/register">Register</Link></li>
            </>
          )}
        </ul>

        {isAuthenticated && (
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
