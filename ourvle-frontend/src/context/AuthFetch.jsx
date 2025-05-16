import { useNavigate, useLocation } from "react-router-dom";

const useAuthFetch = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const redirectPath = encodeURIComponent(location.pathname + location.search);

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(url, { ...options, headers });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate(`/?redirect=${redirectPath}`);
        return null;
      }

      return response;
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  };

  return authFetch;
};

export default useAuthFetch;
