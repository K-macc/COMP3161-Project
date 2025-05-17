import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, role, setIsAuthenticated, setRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setRole(null);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand" to="/">OurVLE</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav">
          {isAuthenticated ? (
            <>
              <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>

              {role === "student" && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/register-course">Course Registration</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/my-courses">My Courses</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/my-events">My Events</Link></li>
                </>
              )}

              {role === "lecturer" && (
                <li className="nav-item"><Link className="nav-link" to="/my-courses">My Courses</Link></li>
              )}

              {role === "admin" && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/create-course">Create Course</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/courses-list">Courses List</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/student-courses">Student Courses</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/lecturer-courses">Lecturer Courses</Link></li>
                </>
              )}

              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item"><Link className="nav-link" to="/">Login</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
