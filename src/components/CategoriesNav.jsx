import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Dashboard.css";

function CategoriesNav() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Resize Effect
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsCategoriesOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch cart and wishlist counts
  const fetchCounts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCartCount(0);
      setWishlistCount(0);
      return;
    }

    try {
      const [cartRes, wishlistRes] = await Promise.all([
        fetch("https://e-commerce-website-backend-d84m.onrender.com/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://e-commerce-website-backend-d84m.onrender.com/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (cartRes.ok) {
        const cartData = await cartRes.json();
        setCartCount(cartData.cart ? cartData.cart.length : 0);
      }

      if (wishlistRes.ok) {
        const wishlistData = await wishlistRes.json();
        setWishlistCount(
          wishlistData.wishlist ? wishlistData.wishlist.length : 0,
        );
      }
    } catch (err) {
      console.error("Error fetching counts:", err);
    }
  };

  // Fetch counts on component mount and when token changes
  useEffect(() => {
    fetchCounts();
  }, [token]);

  // Listen for cart/wishlist updates from other components
  useEffect(() => {
    const handleCartUpdate = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("https://e-commerce-website-backend-d84m.onrender.com/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCartCount(data.cart ? data.cart.length : 0);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    const handleWishlistUpdate = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("https://e-commerce-website-backend-d84m.onrender.com/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setWishlistCount(data.wishlist ? data.wishlist.length : 0);
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    };
  }, []);

  // Auth Sync Effect
  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("authChanged", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("authChanged", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);
  const handleCategoryClick = () => {
    setIsCategoriesOpen(false);
  };

  const toggleFilterBar = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <>
      <div
        className="categories-nav bg-dark-subtle"
        style={{
          marginTop: isCategoriesOpen ? "-20px" : "-2px",
          cursor: "pointer",
        }}
      >
        <div className="categories-top ">
          <button
            className="categories-hamburger"
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
          >
            <i
              className={`fa-solid ${isCategoriesOpen ? "fa-xmark" : "fa-bars"}`}
            ></i>
          </button>
          <button className="filter-toggle-btn mx-3" onClick={toggleFilterBar}>
            <i className="fa-solid fa-sliders fs-4 text-dark"></i>
          </button>
          {/* Mobile Icons */}
          <div className="cart-icons">
            <div style={{ position: "relative", display: "inline-block" }}>
              <i
                className="fa-solid fa-heart fs-4 mx-4 text-dark"
                onClick={() => {
                  if (!token) {
                    navigate("/login");
                  } else {
                    navigate("/wishlist");
                  }
                }}
              ></i>
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "0px",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </div>
            <div style={{ position: "relative", display: "inline-block" }}>
              <i
                className="fa-solid fa-cart-shopping fs-4 text-dark"
                onClick={() => {
                  if (!token) {
                    navigate("/login");
                  } else {
                    navigate("/cart");
                  }
                }}
              ></i>
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "0px",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>

        <ul className={`categories-links ${isCategoriesOpen ? "active" : ""}`}>
          <li>
            <Link to="/Shop/Men" className="text-dark">
              Men
            </Link>
          </li>
          <li>
            <Link to="/Shop/Women" className="text-dark">
              Women
            </Link>
          </li>
          <li>
            <Link to="/Shop/Kids" className="text-dark">
              Kids
            </Link>
          </li>
          <li>
            <Link to="/Shop/Beauty" className="text-dark">
              Beauty
            </Link>
          </li>
          <li>
            <Link to="/Shop/Home" className="text-dark">
              Home
            </Link>
          </li>
          <li>
            <Link to="/Shop/Electronics" className="text-dark">
              Electronics
            </Link>
          </li>
        </ul>

        {/* Desktop Icons */}
        <div className="categories-desktop">
          <div>
            <div style={{ position: "relative", display: "inline-block" }}>
              <i
                className="fa-solid fa-heart fs-4 mx-4 text-dark pt-3"
                onClick={() => {
                  if (!token) {
                    navigate("/login");
                  } else {
                    navigate("/wishlist");
                  }
                }}
              ></i>
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 3,
                    right: 13,
                    backgroundColor: "#e74c3c",
                    color: "white",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </div>
            <div style={{ position: "relative", display: "inline-block" }}>
              <i
                className="fa-solid fa-cart-shopping fs-4 text-dark"
                onClick={() => {
                  if (!token) {
                    navigate("/login");
                  } else {
                    navigate("/cart");
                  }
                }}
              ></i>
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -13,
                    right: -10,
                    backgroundColor: "#e74c3c",
                    color: "white",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {location.pathname !== "/Chatbot" && <div className="extra"></div>}{" "}
    </>
  );
}

export default CategoriesNav;
