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
import IndividualCV from "./components/CV_get/IndividualCV";
import UpdateCV from "./components/CV_update/UpdateCV";
import { ToastContainer, toast } from "react-toastify";

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
    
    toast.success("Logging Out...", {
      position: "top-right",
      autoClose: 2000,  
    });
   
    setTimeout(() => {
      setIsLoggedIn(false);
      localStorage.clear();
      navigate("/");   
    }, 3000); 
  };

  return (
    <div>
      <ToastContainer />
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
        <Route path="/get-cv/:cvId" element={<PrivateRoute isLoggedIn={isLoggedIn}> <IndividualCV/> </PrivateRoute>} /> 
        <Route path="/update-cv/:cvId" element={<PrivateRoute isLoggedIn={isLoggedIn}> <UpdateCV/> </PrivateRoute>} />
        <Route path="/" element={<Login onLogin={handleLogin} />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/forgotpass" element={<ForgotPass />}></Route>
        <Route path="/resetpass/:token" element={<ResetPass />}></Route>
      </Routes>
    </div>
  );
}

export default App;
