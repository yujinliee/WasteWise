// src/Components/UserRoute.js
import { Navigate } from "react-router-dom";
import { auth } from "./firebase";

const UserRoute = ({ children }) => {
  const user = auth.currentUser;

  // If not logged in, send to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Optional: if you want to block admin from accessing user pages
  if (user.email === "admin@gmail.com") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default UserRoute;
