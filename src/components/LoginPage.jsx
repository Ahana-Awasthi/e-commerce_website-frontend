import React, { useState, useContext } from "react";
import { loginWithGoogle, signupWithGoogle } from "../firebaseAuth";
import { TextField } from "@mui/material";
import NavBar from "./Nav";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Toast = ({ message, isError }) => {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: isError ? "#ff6b6b" : "#2ecc71",
        color: "#fff",
        padding: "15px 20px",
        borderRadius: "6px",
        fontSize: "14px",
        zIndex: 9999,
        opacity: 0.9,
        display: "flex",
        alignItems: "center",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {message}
    </div>
  );
};

const Auth = () => {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState(""); // Only for signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [phone, setPhone] = useState(""); // Only for signup
  const [address, setAddress] = useState(""); // Only for signup
  const [confirmPassword, setConfirmPassword] = useState(""); // Only for signup
  const [toastMessage, setToastMessage] = useState("");
  const [toastError, setToastError] = useState(false);
  const navigate = useNavigate();

  const showToast = (msg, isError = false) => {
    setToastMessage(msg);
    setToastError(isError);
    setTimeout(() => setToastMessage(""), 2000);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();

      if (result.success) {
        // Store token and user info
        localStorage.setItem("token", result.token);
        localStorage.setItem("userName", result.user.name);
        localStorage.setItem("userEmail", result.user.email);
        localStorage.setItem("userId", result.user.id);

        // Trigger auth change event
        window.dispatchEvent(new Event("authChanged"));

        showToast("Login successful!");
        setTimeout(() => navigate("/dashboard"), 500);
      } else {
        showToast(result.message, true);
      }
    } catch (err) {
      console.error("Google login error:", err);
      showToast("Google login failed", true);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signupWithGoogle();

      if (result.success) {
        // Store token and user info
        localStorage.setItem("token", result.token);
        localStorage.setItem("userName", result.user.name);
        localStorage.setItem("userEmail", result.user.email);
        localStorage.setItem("userId", result.user.id);

        // Trigger auth change event
        window.dispatchEvent(new Event("authChanged"));

        showToast("Sign up successful!");
        setTimeout(() => navigate("/dashboard"), 500);
      } else {
        showToast(result.message, true);
      }
    } catch (err) {
      console.error("Google signup error:", err);
      showToast("Google signup failed", true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // Login existing user - use AuthContext
        await login(email, password);
        showToast("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 500);
        fetch("https://e-commerce-website-backend-d84m.onrender.com/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email,
            subject: "Login Successful on MyApp",
            text: `Hi ${name},

You have successfully logged into MyApp. We're glad to see you back!

Here’s a quick overview of what you can do:
- Browse our latest products
- Check your wishlist for updates
- Enjoy personalized recommendations

If this wasn’t you, please secure your account immediately.

Thanks,
The MyApp Team`,
          }),
        });
      } else {  
        // Sign up new user
        if (password !== confirmPassword) {
          showToast("Passwords do not match!", true);
          fetch("https://e-commerce-website-backend-d84m.onrender.com/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: email,
              subject: "Login Successful on MyApp",
              text: `Hi ${name},

            Welcome to MyApp! We're thrilled to have you on board. Here’s a quick overview of what you can do:

            - Browse our latest products
            - Add favorites to your wishlist
            - Enjoy personalized recommendations

            If you have any questions, our support team is always happy to help.

            Thanks,
            The MyApp Team`,
            }),
          });
          return;
        }

        const res = await axios.post("https://e-commerce-website-backend-d84m.onrender.com/api/register", {
          name,
          email,
          password,
          phone: phone || "Not provided", // optional
          address: address || "Not provided", // optional
        });

        console.log("Registration response:", res.data); // debug
        showToast("Registration successful! Please login.");
        fetch("https://e-commerce-website-backend-d84m.onrender.com/users/welcome-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, name: name }),
        });
        setIsLogin(true); // switch to login page
      }
    } catch (err) {
      console.error("Login/Register error:", err.response?.data || err.message);
      showToast(
        err.response?.data?.msg || "Error occurred. Check console for details.",
        true,
      );
    }
  };

  return (
    <>
      <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />
      <Toast message={toastMessage} isError={toastError} />

      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title" style={{ fontSize: 40 }}>
            {isLogin ? "Login" : "Sign Up"}
          </h1>

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
            {!isLogin && (
              <TextField
                label="Phone Number"
                type="tel"
                variant="outlined"
                fullWidth
                value="Not provided"
                margin="normal"
                onChange={(e) => setPhone(e.target.value)}
              />
            )}
            {!isLogin && (
              <TextField
                label="Address: City, State, Country"
                type="text"
                variant="outlined"
                fullWidth
                margin="normal"
                value="Not provided"
                onChange={(e) => setAddress(e.target.value)}
              />
            )}

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

          {isLogin ? (
            <>
              <div className="google-auth-divider">
                <span>Or continue with</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="btn-google"
              >
                <i className="fab fa-google"></i>
                <span>Log In with Google</span>
              </button>
            </>
          ) : (
            <>
              <div className="google-auth-divider">
                <span>Or sign up with</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignup}
                className="btn-google"
              >
                <i className="fab fa-google"></i>
                <span>Sign Up with Google</span>
              </button>
            </>
          )}

          <p className="switch-text">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="switch-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Create Account" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Auth;
