import { useState } from "react";
import { Route, Routes, BrowserRouter, useNavigate } from "react-router-dom";
import ForgotPass from "./Pages/ForgotPass/ForgotPass";
import Home from "./Pages/Home/Home";
import ResetPass from "./Pages/ResetPass/ResetPass";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import localStorageUtils from "./utils/localStorageUtils";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

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
          path="/home"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Home handleLogout={handleLogout} />
            </PrivateRoute>
          }
        ></Route>
        <Route path="/" element={<Login onLogin={handleLogin} />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/forgotpass" element={<ForgotPass />}></Route>
        <Route path="/resetpass/:token" element={<ResetPass />}></Route>
      </Routes>
    </div>
  );
}

export default App;
