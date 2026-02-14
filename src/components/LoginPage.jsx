import React, { useState } from "react";
import { TextField } from "@mui/material";
import "./Login.css";


const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState(""); // Only for signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Only for signup

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // Login existing user
        const res = await axios.post("/users/login", { email, password });
        localStorage.setItem("token", res.data.token); // store JWT
        alert("Login successful");
        // update app-level user state if needed
      } else {
        // Sign up new user
        if (password !== confirmPassword) {
          alert("Passwords do not match");
          return;
        }

        await axios.post("/users/register", { name, email, password });
        alert("Registration successful. Please login.");
        setIsLogin(true); // switch to login page
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Error occurred");
    }
  };


  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? "Login" : "Sign Up"}</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!isLogin && (
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          <button type="submit" className="btn-cta">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="switch-text">
          {isLogin
            ? "Don't have an account? "
            : "Already have an account? "}
          <span
            className="switch-link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Create Account" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
