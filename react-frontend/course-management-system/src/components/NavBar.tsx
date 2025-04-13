import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

interface Protected {
  user_id: string;
  role: string;
}

export default function Navbar() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token
        if (!token){
          setIsAuthenticated(false);
          return;
        } 
        const response = await axios.get<Protected>(
          "http://localhost:5000/auth/protected",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUserRole(response.data.role);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error fetching user role:", error);
        setIsAuthenticated(false);
      }
    };

    fetchUserRole();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserRole(null);
    setIsAuthenticated(false); // Refresh navbar
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Course Management
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            title="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              {!isAuthenticated && location.pathname !== "/register" && (
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    Register
                  </Link>
                </li>
              )}

              {isAuthenticated && userRole === "student" && (
                <>
                  <li className="nav-item">
                    <Link to="/register-course" className="nav-link">
                      Register For A Course
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/specific-courses" className="nav-link">
                      My Courses
                    </Link>
                  </li>
                </>
              )}

              {isAuthenticated && userRole === "lecturer" && (
                <>
                  <li className="nav-item">
                    <Link to="/course-members" className="nav-link">
                      Course Members
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/specific-courses" className="nav-link">
                      My Courses
                    </Link>
                  </li>
                </>
              )}

              {isAuthenticated && userRole === "admin" && (
                <>
                  <li className="nav-item">
                    <Link to="/create-course" className="nav-link">
                      Create Course
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/course-members" className="nav-link">
                      Course Members
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/courses" className="nav-link">
                      All Courses
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/student-courses" className="nav-link">
                      Student Courses
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/lecturer-courses" className="nav-link">
                      Lecturer Courses
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <ul className="navbar-nav ms-auto">
              {isAuthenticated ? (
                <li className="nav-item">
                  <Link onClick={handleLogout} to="/login" className="nav-link">
                    Logout
                  </Link>
                </li>
              ) : (
                location.pathname !== "/login" && (
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">
                      Login
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
