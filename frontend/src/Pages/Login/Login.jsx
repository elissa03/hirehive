import React, { useState } from "react";
import styles from "./styles.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import honeycomb from "../../assets/honeycomb.jpeg";
import googleIcon from "../../assets/google.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authService from "../../services/authService";
import localStorageUtils from "../../utils/localStorageUtils";
import { useNavigate } from "react-router-dom";

// TODO: implement sign in with google

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async () => {
    setError("");
    try {
      // check if both fields are filled
      if (!email || !password) {
        setError("Email and Password are required.");
        return; // stop the function if validation fails
      }

      // check if the email follows the correct format
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address.");
        return; // stop the function if validation fails
      }

      const response = await authService.login(email, password);
      console.log("login res", response);

      if (response.status === 200) {
        let authenticatedUser = response.data.user;
        authenticatedUser.token = response.data.token;
        //console.log(authenticatedUser);
        localStorageUtils.setLocalStorageUser(authenticatedUser);
        console.log("Preparing to show success toast");
        toast.success("Logged in successfully", {
          position: "top-center",
          autoClose: 2000, // display for 2 seconds
          onClose: () => {
            // ensure onLogin and navigation occur after the toast
            onLogin();
            reset(); //clear the form fields
            navigate("/dashboard");
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
    }
  };

  const reset = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <div className={`container-fluid ${styles.smallFont}`}>
      <div className="row">
        <div className={`col-md-7 ${styles.loginContainer}`}>
          {/* Login form */}
          <ToastContainer />
          <div className={`card ${styles.cardNoBorder}`}>
            <div className={`card-body ${styles.formPadding}`}>
              <h3 className={`mb-3 ${styles.leftAlignText}`}>
                Welcome Back 👋
              </h3>
              <p className={`text-secondary ${styles.leftAlignText}`}>
                Craft your professional story and discover new career
                opportunities.
              </p>
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className={`form-label ${styles.smallFont}`}
                >
                  Email
                </label>
                <input
                  type="email"
                  className={`form-control ${styles.smallInput}`}
                  placeholder="Example@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="password"
                  className={`form-label ${styles.smallFont}`}
                >
                  Password
                </label>
                <input
                  type="password"
                  className={`form-control ${styles.smallInput}`}
                  placeholder="At least 6 characters"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                  // minLength="8"
                />
              </div>
              <div className="d-flex justify-content-between mb-4">
                <a
                  href="/forgotpass"
                  className={`text-decoration-none  ${styles.forgotPasswordButton}`}
                >
                  Forgot Password?
                </a>
              </div>
              {error && <div className={styles.error_msg}>{error}</div>}
              <button
                type="submit"
                className={`btn w-100 mb-3 ${styles.signInButton} ${styles.smallButton}`}
                onClick={handleLogin}
              >
                Sign In
              </button>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0px 0 20px 0",
                }}
              >
                <div
                  style={{
                    borderBottom: "1px solid #CFDFE2",
                    flexGrow: 1,
                    marginRight: "10px",
                  }}
                ></div>
                <span style={{ padding: "0 10px", color: "#294957" }}>Or</span>
                <div
                  style={{
                    borderBottom: "1px solid #CFDFE2",
                    flexGrow: 1,
                    marginLeft: "10px",
                  }}
                ></div>
              </div>
              <button
                type="button"
                className={`btn btn-light border w-100 mb-3 ${styles.smallButton}`}
              >
                <img
                  src={googleIcon}
                  alt="Google sign-in"
                  className={`me-2 ${styles.google}`}
                />
                Sign in with Google
              </button>
              <div className="text-center">
                <span>Don't have an account? </span>
                <a href="/signup" className="text-primary">
                  Sign up
                </a>
              </div>
              <div className="row">
                <div className="col-12 text-center mt-4">
                  <p style={{ color: "#959CB6", marginTop: "0px" }}>
                    © 2024 ALL RIGHTS RESERVED
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`col-md-5 ${styles.honeycombContainer}`}
          style={{ backgroundImage: `url(${honeycomb})` }}
        ></div>
      </div>
    </div>
  );
}

export default Login;
