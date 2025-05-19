// src/auth/PrivateRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function PrivateRoute({ children }) {
  const { authTokens } = useContext(AuthContext);
  // If authTokens is falsy → redirect to /login
  return authTokens ? children : <Navigate to="/login" replace />;
  // return children;
}
