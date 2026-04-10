import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Hook to use AuthContext
 * Provides auth state and functions
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
