// firebaseAuth.js
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./firebase";
import axios from "axios";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Login-only version
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const { email, displayName, uid } = result.user;

    // Call backend login route (no password)
    const loginRes = await axios.post(
      "https://e-commerce-website-backend-d84m.onrender.com/api/google-login",
      {
        email,
        uid, // you can use this as unique identifier
      },
    );

    return {
      success: true,
      user: loginRes.data.user,
      token: loginRes.data.token,
    };
  } catch (err) {
    if (err.response?.status === 400)
      return { success: false, message: "User doesn't exist" };
    return { success: false, message: err.message || "Google login failed" };
  }
};

// Sign-up-only version
export const signupWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const { email, displayName, uid, photoURL } = result.user;

    const registerRes = await axios.post(
      "https://e-commerce-website-backend-d84m.onrender.com/api/google-register",
      {
        email,
        name: displayName || email.split("@")[0],
        uid,
        photoURL,
      },
    );

    return {
      success: true,
      user: registerRes.data.user,
      token: registerRes.data.token,
    };
  } catch (err) {
    if (err.response?.status === 400)
      return { success: false, message: "User already exists" };
    return { success: false, message: err.message || "Google signup failed" };
  }
};
