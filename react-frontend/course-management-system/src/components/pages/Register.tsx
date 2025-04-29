import { useState } from "react";
import axios from "axios";

interface Register {
  name: string;
  username: string;
  password: string;
  role: string;
  message: string;
}
export default function Register() {
  const [formData, setFormData] = useState<Register>({
    name: "",
    username: "",
    password: "",
    role: "",
    message: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post<Register>(
        "http://localhost:5000/auth/register",
        formData
      );
      setMessage(response.data.message);
      setFormData({
        name: "",
        username: "",
        password: "",
        role: "",
        message: "",
      });
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-4">Register</h1>

      {message && <p className="text-center mb-4 text-red-500">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group mb3">
          <label>Role</label>

          <label htmlFor="admin-select">Admin</label>
          <input
            id="admin-select"
            type="radio"
            name="role"
            value="admin"
            checked={formData.role === "admin"}
            className="form-check-input"
            onChange={handleChange}
            required
          />

          <label htmlFor="student-select">Student</label>
          <input
            id="student-select"
            type="radio"
            name="role"
            value="student"
            checked={formData.role === "student"}
            className="form-check-input"
            onChange={handleChange}
            required
          />

          <label htmlFor="lecturer-select">Lecturer</label>
          <input
            id="lecturer-select"
            type="radio"
            name="role"
            value="lecturer"
            checked={formData.role === "lecturer"}
            className="form-check-input"
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
