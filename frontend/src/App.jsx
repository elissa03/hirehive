import { BrowserRouter, Route, Routes } from "react-router-dom";
import ForgotPass from "./Pages/ForgotPass";
import Home from "./Pages/Home";
import ResetPass from "./Pages/ResetPass";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/forgotpass" element={<ForgotPass />}></Route>
        <Route path="/resetpass/:token" element={<ResetPass />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
