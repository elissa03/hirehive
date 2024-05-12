import React, { useState } from "react";
import styles from "./styles.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import honeycomb from "../../assets/honeycomb.jpeg";
import googleIcon from "../../assets/google.png";
import { useNavigate } from "react-router-dom";
import userService from "../../services/userService";
import { ToastContainer, toast } from "react-toastify";
import rocket from '/images/rocket.png';

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
        toast.success("Account successfully created!", {
          position: "top-center",
          autoClose: 2000,
          onClose: () => navigate("/"),
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
    <div className={`container-fluid ${styles.largeFont}`}>
      <div className="row">
        <div
          className={`col-md-5 ${styles.honeycombContainer} ${styles.honeycombFlip}`}
          style={{ backgroundImage: `url(${honeycomb})`, height: "100vh" }}
        ></div>
        <div className={`col-md-7 ${styles.signupContainer}`}>
          <ToastContainer />
          <div className={`card ${styles.cardNoBorder}`}>
            <div className={`card-body ${styles.formPadding}`}>
              <h3 className={`mb-3 ${styles.leftAlignText}`}>
                Join HireHive <img src={rocket} width={'45px'} height={'55px'}/>
              </h3>
              <p className={`text-secondary ${styles.leftAlignText}`}>
                Begin your journey to a fulfilling career with opportunities for
                growth.
              </p>
              <div className="mb-3">
                <label
                  htmlFor="username"
                  className={`form-label ${styles.largeFont}`}
                >
                  Username
                </label>
                <input
                  type="text"
                  className={`form-control ${styles.largeInput}`}
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
                  className={`form-label ${styles.largeFont}`}
                >
                  Email
                </label>
                <input
                  type="email"
                  className={`form-control ${styles.largeInput}`}
                  placeholder="Example@email.com"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="password"
                  className={`form-label ${styles.largeFont}`}
                >
                  Password
                </label>
                <input
                  type="password"
                  className={`form-control ${styles.largeInput}`}
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
                  className={`form-label ${styles.largeFont}`}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  className={`form-control ${styles.largeInput}`}
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
                className={`btn w-100 mb-3 ${styles.signInButton} ${styles.largeButton}`}
                onClick={handleSignup}
              >
                Sign Up
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
