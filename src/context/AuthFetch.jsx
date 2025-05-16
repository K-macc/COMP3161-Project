import { useNavigate, useLocation } from "react-router-dom";

const useAuthFetch = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const redirectPath = encodeURIComponent(location.pathname + location.search);

    const method = options.method ? options.method.toUpperCase() : "GET";

    const headers = {
      "Authorization": `Bearer ${token}`,
      ...options.headers,
    };

    const fetchOptions = {
      ...options,
      method,
      headers,
    };

    try {
      const response = await fetch(url, fetchOptions);

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate(`/?redirect=${redirectPath}`);
        return null;
      }

      return response;
    } catch (error) {
      console.error(`${method} request error:`, error);
      return null;
    }
  };

  return authFetch;
};

export default useAuthFetch;
