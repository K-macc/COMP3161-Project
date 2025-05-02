import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Login.css"

interface Login {
  user_id: string;
  password: string;
  access_token: string;
}

export default function Login() {
  const [formData, setFormData] = useState<Login>({
    user_id: "",
    password: "",
    access_token: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post<Login>(
        "http://localhost:5000/api/login",
        formData
      );

      localStorage.setItem("token", response.data.access_token); // Store token for authentication

      alert("Login Successful!");
      navigate("/");
      window.location.reload();
    } catch (err: any) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg login-container">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="mb-3">
            <label htmlFor="user_id" className="form-label">
              User ID
            </label>
            <input
              type="text"
              name="user_id"
              id="user_id"
              value={formData.user_id}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your User ID"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="form-control" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
