import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import "./CSS/ResetPassword.css";

export default function ResetPassword() {
  const { id, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const { data } = await axios.get(`/reset-password/${id}/${token}`);

        if (data.error) {
          navigate("/login");
          setTimeout(() => {
            toast.error(data.error);
          }, 3000);
        }
      } catch (error) {
        console.log(error);
      }
    };
    verifyToken();
  }, [id, token]);

  const resetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match. Please try again.");
      return;
    }

    try {
      const { data } = await axios.post(`/reset-password/${id}/${token}`, {
        password,
      });

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
    <div className="reset-password-container">
      <div className="card">
        <div className="card2">
          <form onSubmit={resetPassword} className="form">
            <h1 id="heading">Reset Password</h1>
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
                type="password"
                className="input-field"
                placeholder="Enter New Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
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
                type="password"
                className="input-field"
                placeholder="Confirm New Password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="button1">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
