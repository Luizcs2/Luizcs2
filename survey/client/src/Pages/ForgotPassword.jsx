import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import "./CSS/ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const forgotPassword = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/forgot-password", { email });

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="card">
        <div className="card2">
          <form className="form" onSubmit={forgotPassword}>
            <h1 id="heading">MU Forgot Password</h1>
            <div className="field">
              <svg
                className="input-icon"
                viewBox="0 0 16 16"
                fill="currentColor"
                height="16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8" cy="5" r="4"></circle>
                <rect x="3" y="9" width="10" height="2" rx="1"></rect>
              </svg>
              <input
                type="email"
                className="input-field"
                placeholder="Email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="button3" type="submit">
              Send Reset Link
            </button>
            <div className="horizontal-buttons">
              <Link to="/login" className="button1">
                Login
              </Link>
              <Link to="/register" className="button2">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
