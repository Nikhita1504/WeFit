import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import MobileHome from "./pages/MobileHome";
import DesktopHome from "./pages/DesktopHome";
import DesktopLogin from "./pages/DesktopLogin";
import MobileLogin from "./pages/MobileLogin";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Responsive component selection based on device type
  const ResponsiveHome = () => (isMobile ? <MobileHome /> : <DesktopHome />);
  const ResponsiveLogin = () => (isMobile ? <MobileLogin setIsLoggedIn={setIsLoggedIn} /> : <DesktopLogin setIsLoggedIn={setIsLoggedIn} />);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<ResponsiveLogin />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <ResponsiveHome />
              </ProtectedRoute>
            } 
          />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
