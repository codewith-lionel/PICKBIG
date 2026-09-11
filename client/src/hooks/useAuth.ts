import { useEffect, useState } from "react";
import { setAuthToken } from "../services/api";

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return { token, setToken, isAuthenticated: Boolean(token) };
}
