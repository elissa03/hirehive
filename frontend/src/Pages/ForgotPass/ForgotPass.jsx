import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./styles.module.css";
import authService from "../../services/authService";
import { ToastContainer, toast } from "react-toastify";


// TODO: fix design 


function ForgotPass() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async () => {
    try {
      if (!email) {
        setError("Please input your email");
        //console.log("Please input your email");
        return;
      }
      if (!emailRegex.test(email)) {
        //console.log("Please enter a valid email address.");
        setError("Please enter a valid email address.");
        return;
      }
      const response = await authService.forgotPass(email);
      if (response.status === 200) {
        console.log(response.data.message);
        toast.success("Check your email", {
          position: "top-center",
          autoClose: 2000,
          onClose: () => {
            reset(); //clear the form fields
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
    setEmail("");
  };
  
  return (
    <div
      className={`container-fluid vh-100 d-flex flex-column ${styles.container} ${styles.backgroundAfter}`}
    >
      {/* Content container */}
      <div className="row flex-grow-1 justify-content-center align-items-center">
        <ToastContainer />
        <div className="col-sm-8 col-md-6 col-lg-4">
          <div className={`card p-4 ${styles.card}`}>
            <h2 className={`text-center ${styles.title}`}>Forgot Password</h2>
            <div className="form-group">
              <label htmlFor="email" className={`bee-label ${styles.label}`}>
                Email:
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && <div>{error}</div>}
            <div className="d-flex justify-content-center mt-3">
              <button
                type="submit"
                className={`btn ${styles.btnSubmit}`}
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPass;
