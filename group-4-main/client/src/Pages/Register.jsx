import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import "./CSS/Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const registerUser = async (e) => {
    e.preventDefault();
    const { name, email, password } = data;

    try {
      const { data } = await axios.post("/register", {
        name,
        email,
        password,
      });

      if (data.error) {
        toast.error(data.error);
      } else {
        setData({});
        toast.success("Registration Successful. Please log in!");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="register-container">
      <div className="card">
        <div className="card2">
          <form className="form" onSubmit={registerUser}>
            <h1 id="heading">MU Quest Signup</h1>
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
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
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
                <rect x="3" y="7" width="10" height="6" rx="1"></rect>
                <rect x="6" y="1" width="4" height="6" rx="2"></rect>
              </svg>
              <input
                type="text"
                className="input-field"
                placeholder="Name"
                autoComplete="off"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
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
                <rect x="3" y="7" width="10" height="6" rx="1"></rect>
                <rect x="6" y="1" width="4" height="6" rx="2"></rect>
              </svg>
              <input
                type="password"
                className="input-field"
                placeholder="Password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </div>
            <button className="button2" type="submit">
              Sign Up
            </button>
            <div className="horizontal-buttons">
              <Link to="/login" className="button1">
                Login
              </Link>
              <Link to="/forgot-password" className="button3">
                Forgot Password
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
