import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import MobileHome from "./pages/MobileHome";
import DesktopHome from "./pages/DesktopHome";
import DesktopLogin from "./pages/DesktopLogin";
import Details from "./pages/Details";
import MobileLogin from "./pages/MobileLogin";

import Challenge from "./pages/Challenge";
import Walletprovider from "./context/walletprovider";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ChallengeProvider } from "./context/ChallengeContext";
import Contractprovider from "./context/Contractprovider";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    const location = useLocation();

    if (!token) {
      return <Navigate to="/login" 
      // state={{ from: location }} 
       />;
    }
    return children;
  };

  const ResponsiveHome = () => (isMobile ? <MobileHome /> : <DesktopHome />);
  const ResponsiveLogin = () => (isMobile ? <MobileLogin /> : <DesktopLogin />);

  return (
    <Contractprovider>
 <Walletprovider>
      <AuthProvider>
      <ChallengeProvider>
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
              <Route
                path="/challenge"
                element={
                  <ProtectedRoute>
                    <Challenge />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/details"
                element={
                  <ProtectedRoute>
                    <Details />
                  </ProtectedRoute>
                }
              />

              {/* Add more routes as needed */}
            </Routes>
          </div>
        </Router>
      </ChallengeProvider>
      </AuthProvider>
    </Walletprovider>
    </Contractprovider>
   
  );
}

export default App;
