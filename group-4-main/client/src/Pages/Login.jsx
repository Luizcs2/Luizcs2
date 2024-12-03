import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { UserContext } from "../../context/userContext";
import { useNavigate, Link } from "react-router-dom";
import "./CSS/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const { user, setUser, loading } = useContext(UserContext);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
      toast.success("Already Logged in");
    }
  }, [user, loading]);

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;

    try {
      const { data } = await axios.post("/login", {
        email,
        password,
      });

      if (data.error) {
        toast.error(data.error);
      } else {
        setUser(data);
        setData({});
        toast.success("Login Successful");
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Error" + error);
    }
  };

  return (
    <div className="login-container">
      <div className="card">
        <div className="card2">
          <form className="form" onSubmit={loginUser}>
            <h1 id="heading">MU Quest Login</h1>
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
                type="text"
                className="input-field"
                placeholder="Email Address"
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
                type="password"
                className="input-field"
                placeholder="Password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </div>
            <button className="button1" type="submit">
              Login
            </button>
            <div className="btn">
              <Link to="/register" className="button2">
                Sign Up
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
