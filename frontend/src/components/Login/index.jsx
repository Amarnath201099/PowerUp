import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { IoEye, IoEyeOff } from "react-icons/io5";
import "./index.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    const userCredentials = { email, password };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCredentials),
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        options
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      Cookies.set("jwt_token", data.jwt_token, { expires: 7 });
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Network or unexpected error:", error);
      setError("Failed to login. Try again later.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Email:</label>
          <br />
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </div>

        <div className="form-group password-group">
          <label>Password:</label>
          <br />
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOff /> : <IoEye />}
            </span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="btn-submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
