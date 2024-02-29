import React, { useState, useEffect } from "react";
import authService from "../../services/authService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

// TODO: fix design

function ResetPass() {
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const urlToken = window.location.pathname.split("/resetpass/")[1];
    if (urlToken) {
      //console.log(urlToken)
      setToken(urlToken);
    }
  }, []);

  const handleSubmit = async () => {
    setError("");
    try {
      if (!password || !confirm_password) {
        setError("Please fill in all fields");
        return;
        //console.log("Please fill in all fields");
      }

      if (password !== confirm_password) {
        setError("Passwords don't match");
        return;
        //console.log("Passwords don't match");
      }

      const response = await authService.resetPass(
        token,
        password,
        confirm_password
      );

      console.log(response);

      if (response.status === 200) {
        console.log("Password reset successfully");
        toast.success("Password reset successfully", {
          position: "top-center",
          autoClose: 2000, // display for 2 seconds
          onClose: () => {
            reset(); //clear the form fields
            navigate("/");
          },
        });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
      //console.log(error);
    }
  };

  const reset = () => {
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h2>Reset Password</h2>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="confirm_password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirm_password}
              required
            />
          </div>
          {error && <div>{error}</div>}
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPass;
