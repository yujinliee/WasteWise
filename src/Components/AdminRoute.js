// src/Components/AdminRoute.js
import { Navigate } from "react-router-dom";
import { auth } from "./firebase";

const AdminRoute = ({ children }) => {
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.email !== "admin@gmail.com") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
