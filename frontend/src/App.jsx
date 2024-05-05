import { useState, useEffect } from "react";
import { Route, Routes, BrowserRouter, useNavigate } from "react-router-dom";
import ForgotPass from "./Pages/ForgotPass/ForgotPass";
import Dashboard from "./Pages/Dashboard/Dashboard";
import ResetPass from "./Pages/ResetPass/ResetPass";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import localStorageUtils from "./utils/localStorageUtils";
import PrivateRoute from "./components/PrivateRoute";
import CreateCV from "./components/CV_form/CreateCV";
import CVsPanel from "./components/CVsPanel/CVsPanel";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorageUtils.isUserLoggedIn());
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(localStorageUtils.isUserLoggedIn());
  }, []);
 
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Dashboard handleLogout={handleLogout} />
            </PrivateRoute>
          }
        ></Route>        
        <Route path="/create-cv" element={<PrivateRoute isLoggedIn={isLoggedIn}> <CreateCV/> </PrivateRoute>} />
        <Route path="/cvs-panel" element={<PrivateRoute isLoggedIn={isLoggedIn}> <CVsPanel/> </PrivateRoute>} />
        <Route path="/" element={<Login onLogin={handleLogin} />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/forgotpass" element={<ForgotPass />}></Route>
        <Route path="/resetpass/:token" element={<ResetPass />}></Route>
      </Routes>
    </div>
  );
}

export default App;
