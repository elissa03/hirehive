import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import honeycomb from "../../assets/honeycomb.jpeg";
import googleIcon from "../../assets/google.png";
import { useNavigate } from "react-router-dom";
import userService from "../../services/userService";
import { ToastContainer, toast } from "react-toastify";

// TODO: implement sign up with google

function Signup() {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = () => initGoogleSignIn();
      document.body.appendChild(script);
    };

    const initGoogleSignIn = () => {
      window.google.accounts.id.initialize({
        client_id:
          "552189366871-65676mpr7eue0adi8aj5j236v8k0ve6p.apps.googleusercontent.com",
        callback: handleGoogleSignUp,
      });
    };
    loadGoogleScript();
  }, []);

   const handleGoogleSignUp = async(response) => {
    const token = response.credential;
   };

  const handleSignup = async () => {
    setError("");
    try {
      if (
        !data.username ||
        !data.email ||
        !data.password ||
        !data.confirm_password
      ) {
        setError("Please fill in all fields.");
        return;
      }
      if (!emailRegex.test(data.email)) {
        setError("Please enter a valid email address.");
        return;
      }
      if (data.password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }

      const response = await userService.signup({
        username: data.username,
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password,
      });

      if (response.status === 201) {
        // console.log("sign up success", response.data);
        toast.success("Account successfully created!", {
          position: "top-center",
          autoClose: 2000,
          onClose: () => navigate("/"), // Redirect after the toast message
        });
        reset();
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
    setData({
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    });
    setError("");
  };

  return (
    <div className={`container-fluid ${styles.smallFont}`}>
      <div className="row">
        <div
          className={`col-md-5 ${styles.honeycombContainer} ${styles.honeycombFlip}`}
          style={{ backgroundImage: `url(${honeycomb})` }}
        ></div>
        <div className={`col-md-7 ${styles.signupContainer}`}>
          <ToastContainer />
          {/* Sign Up form */}
          <div className={`card ${styles.cardNoBorder}`}>
            <div className={`card-body ${styles.formPadding}`}>
              <h3 className={`mb-3 ${styles.leftAlignText}`}>
                Join HireHive 🚀
              </h3>
              <p className={`text-secondary ${styles.leftAlignText}`}>
                Begin your journey to a fulfilling career with opportunities for
                growth.
              </p>
              <div className="mb-3">
                <label
                  htmlFor="username"
                  className={`form-label ${styles.smallFont}`}
                >
                  Username
                </label>
                <input
                  type="text"
                  className={`form-control ${styles.smallInput}`}
                  placeholder="Example123"
                  value={data.username}
                  onChange={(e) =>
                    setData({ ...data, username: e.target.value })
                  }
                  required
                />
              </div>
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
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
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
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="confirmpassword"
                  className={`form-label ${styles.smallFont}`}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  className={`form-control ${styles.smallInput}`}
                  placeholder="At least 6 characters"
                  value={data.confirm_password}
                  onChange={(e) =>
                    setData({ ...data, confirm_password: e.target.value })
                  }
                  required
                />
              </div>
              {error && <div className={styles.error_msg}>{error}</div>}
              <button
                type="submit"
                className={`btn w-100 mb-3 ${styles.signInButton} ${styles.smallButton}`}
                onClick={handleSignup}
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
                onClick={() => window.google.accounts.id.prompt()}
              >
                <img
                  src={googleIcon}
                  alt="Google sign-in"
                  className={`me-2 ${styles.google}`}
                />
                Sign up with Google
              </button>
              <div className="text-center">
                <span>Already have an account? </span>
                <a href="/" className="text-primary">
                  Login
                </a>
              </div>
              <div className="row">
                <div className="col-12 text-center mt-4">
                  <p style={{ color: "#959CB6" }}>© 2024 ALL RIGHTS RESERVED</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
