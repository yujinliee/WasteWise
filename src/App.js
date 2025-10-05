import './App.css';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import Login from './pages/LoginModal';
import Dashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminRoute from "./Components/AdminRoute";
import UserRoute from "./Components/UserRoute";
import Users from "./pages/Users";  
import AdminBins from "./pages/AdminBins";
import AdminNotifications from "./pages/AdminNotification";
import AdminSettings from "./pages/AdminSettings";
import UserBins from "./pages/UserBins";
import UserNotifications from "./pages/UserNotifications";
import UserSettings from "./pages/UserSettings";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* User Routes */} 
          <Route 
            path="/dashboard"
            element={
              <UserRoute>
                <Dashboard />
              </UserRoute>
            }
          />
          <Route 
            path="/bins"
            element={
              <UserRoute>
                <UserBins />
              </UserRoute>
            }
          />
          <Route 
            path="/notifications"
            element={
              <UserRoute>
                <UserNotifications />
              </UserRoute>
            }
          />
          <Route 
            path="/settings"
            element={
              <UserRoute>
                <UserSettings />
              </UserRoute>
            }
          />


          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <AdminRoute>
                <Users />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/bins" 
            element={
              <AdminRoute>
                <AdminBins />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/notifications" 
            element={
              <AdminRoute>
                <AdminNotifications />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <AdminRoute>
                <AdminSettings />
              </AdminRoute>
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
