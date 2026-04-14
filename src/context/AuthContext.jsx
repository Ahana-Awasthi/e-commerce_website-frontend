import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    user: {
      id: localStorage.getItem("userId") || null,
      name: localStorage.getItem("userName") || null,
      email: localStorage.getItem("userEmail") || null,
      phone: localStorage.getItem("userPhone") || null,
      address: localStorage.getItem("userAddress") || null,
    },
  });
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    const res = await axios.post(
      "https://e-commerce-website-backend-d84m.onrender.com/api/refresh",
      { refreshToken },
    );

    localStorage.setItem("token", res.data.token);

    return res.data.token;
  };
  const withAutoRefresh = async (apiCall) => {
    try {
      return await apiCall();
    } catch (err) {
      if (err.response?.status === 401) {
        const newToken = await refreshAccessToken();

        return await apiCall(newToken);
      }
      throw err;
    }
  };
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user data on app load or when token changes
  const initializeUserData = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch cart data
      try {
        const cartRes = await axios.get(
          "https://e-commerce-website-backend-d84m.onrender.com/api/cart",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const cartData = Array.isArray(cartRes.data.cart)
          ? cartRes.data.cart
          : [];
        setCart(cartData);
        console.log("✅ Cart initialized:", cartData);
      } catch (cartErr) {
        console.error("Error fetching cart:", cartErr);
        setCart([]);
      }

      // Fetch wishlist data
      try {
        const wishlistRes = await axios.get(
          "https://e-commerce-website-backend-d84m.onrender.com/api/wishlist",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const wishlistData = Array.isArray(wishlistRes.data.wishlist)
          ? wishlistRes.data.wishlist
          : [];
        setWishlist(wishlistData);
        console.log("✅ Wishlist initialized:", wishlistData);
      } catch (wishlistErr) {
        console.error("Error fetching wishlist:", wishlistErr);
        setWishlist([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync auth state when token changes in localStorage
  useEffect(() => {
    const handleAuthChanged = () => {
      const token = localStorage.getItem("token");
      setAuth({
        token,
        user: {
          id: localStorage.getItem("userId") || null,
          name: localStorage.getItem("userName") || null,
          email: localStorage.getItem("userEmail") || null,
          phone: localStorage.getItem("userPhone") || null,
          address: localStorage.getItem("userAddress") || null,
        },
      });

      // If logging out (no token), clear cart and wishlist
      if (!token) {
        setCart([]);
        setWishlist([]);
        setIsLoading(false);
      } else {
        // If logging in, reinitialize data
        setIsLoading(true);
        initializeUserData();
      }
    };

    window.addEventListener("authChanged", handleAuthChanged);
    return () => window.removeEventListener("authChanged", handleAuthChanged);
  }, [initializeUserData]);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "https://e-commerce-website-backend-d84m.onrender.com/api/login",
        {
          email,
          password,
        },
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      if (res.data.user) {
        localStorage.setItem("userId", res.data.user.id || "");
        localStorage.setItem("userName", res.data.user.name || "");
        localStorage.setItem("userEmail", res.data.user.email || "");
        localStorage.setItem("userPhone", res.data.user.phone || "");
        localStorage.setItem("userAddress", res.data.user.address || "");
      }
      localStorage.setItem("userLanguage", "English");

      // Trigger auth change event
      window.dispatchEvent(new Event("authChanged"));

      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.clear();
    setAuth({
      token: null,
      user: {
        id: null,
        name: null,
        email: null,
        phone: null,
        address: null,
      },
    });
    setCart([]);
    setWishlist([]);
    window.dispatchEvent(new Event("authChanged"));
  };

  // Add to cart
  const addToCart = async (productId) => {
    if (!auth.token) {
      throw new Error("User not authenticated");
    }

    try {
      const res = await axios.post(
        "https://e-commerce-website-backend-d84m.onrender.com/api/cart",
        { productId },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        },
      );

      if (res.ok || res.status === 200) {
        // Optimistic update
        setCart((prev) => {
          const existing = prev.find((item) => item[0] === productId);
          if (existing) {
            return prev.map((item) =>
              item[0] === productId
                ? [item[0], String(Number(item[1]) + 1)]
                : item,
            );
          } else {
            return [...prev, [productId, "1"]];
          }
        });
      }
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // Toggle wishlist
  const toggleWishlist = async (productId, isWishlisted) => {
    if (!auth.token) {
      throw new Error("User not authenticated");
    }

    try {
      const res = await axios({
        method: isWishlisted ? "DELETE" : "POST",
        url: "https://e-commerce-website-backend-d84m.onrender.com/api/wishlist",
        data: { productId },
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      if (res.ok || res.status === 200) {
        setWishlist((prev) =>
          isWishlisted
            ? prev.filter((id) => id !== productId)
            : [...prev, productId],
        );
      }
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // Update cart quantity
  const updateCartQuantity = async (productId, quantity) => {
    if (!auth.token) {
      throw new Error("User not authenticated");
    }

    try {
      const res = await axios.put(
        "https://e-commerce-website-backend-d84m.onrender.com/api/cart",
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        },
      );

      if (res.ok || res.status === 200) {
        setCart((prev) =>
          prev.map((item) =>
            item[0] === productId ? [item[0], String(quantity)] : item,
          ),
        );
        // Dispatch event to update navbar badges
        setTimeout(() => {
          window.dispatchEvent(new Event("cartUpdated"));
        }, 100);
      }
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    if (!auth.token) {
      throw new Error("User not authenticated");
    }

    try {
      const res = await axios.delete(
        "https://e-commerce-website-backend-d84m.onrender.com/api/cart",
        {
          data: { productId },
          headers: { Authorization: `Bearer ${auth.token}` },
        },
      );

      if (res.ok || res.status === 200) {
        setCart((prev) => prev.filter((item) => item[0] !== productId));
        // Dispatch event to update navbar badges
        setTimeout(() => {
          window.dispatchEvent(new Event("cartUpdated"));
        }, 100);
      }
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // Create order and clear cart
  const createOrder = async (orderData) => {
    if (!auth.token) {
      throw new Error("User not authenticated");
    }

    try {
      const res = await axios.post(
        "https://e-commerce-website-backend-d84m.onrender.com/api/order",
        orderData,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        },
      );

      if (res.status === 201 || res.status === 200) {
        // Clear cart after successful order
        setCart([]);
        // Dispatch event to update navbar badges
        setTimeout(() => {
          window.dispatchEvent(new Event("cartUpdated"));
        }, 100);
      }
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // Clear cart manually
  const clearCart = async () => {
    if (!auth.token) {
      throw new Error("User not authenticated");
    }

    try {
      await axios.delete(
        "https://e-commerce-website-backend-d84m.onrender.com/api/cart/clear",
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        },
      );
      setCart([]);
      // Dispatch event to update navbar badges
      setTimeout(() => {
        window.dispatchEvent(new Event("cartUpdated"));
      }, 100);
    } catch (err) {
      // If endpoint doesn't exist, just clear locally
      setCart([]);
      setTimeout(() => {
        window.dispatchEvent(new Event("cartUpdated"));
      }, 100);
    }
  };

  const value = {
    // Auth state
    auth,
    isLoading,
    isLoggedIn: !!auth.token,

    // Cart & Wishlist state
    cart,
    wishlist,
    setCart,
    setWishlist,

    // Auth functions
    login,
    logout,

    // Cart functions
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    createOrder,

    // Wishlist functions
    toggleWishlist,

    // Utility to refresh data
    initializeUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
