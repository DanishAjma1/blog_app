import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await axios.get("http://localhost:5000/isloggedin", {
          withCredentials: true,
        });
        if (res.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;
  if (isAuthenticated) return <Outlet />;
  return <Navigate to="/authentication" replace />;
}
