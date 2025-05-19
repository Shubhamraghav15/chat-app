import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./auth/PrivateRoutes";
import NotificationListener from "./components/NotificationListener";
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              {/* <NotificationListener /> */}
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
