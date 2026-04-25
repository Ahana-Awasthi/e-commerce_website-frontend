import React, { useState, useEffect, useContext, useMemo } from "react";
import api from "../api/axios";
import Loading from "./Loading";
import NavBar from "./Nav";
import { useNavigate } from "react-router-dom";
import { useCartWishlist } from "../hooks/useCartWishlist";
import { AuthContext } from "../context/AuthContext";
import "./Wishlist.css";

// Sample products for inspiration/trending section
const allProducts = [
  {
    name: "Women Wide Leg Stretchable Jeans",
    description: "Women Loose Fit High Rise Wide Leg Stretchable Jeans",
    category: "Women Western",
    subCategory: "Jeans",
    originalPrice: 1436,
    discount: 60,
    price: 574,
    imageUrl: "https://i.ibb.co/ds76qx1K/wmn8.png",
    inStock: true,
    color: "Black",
    size: "S , M , L",
  },
  {
    name: "Men Casual Woolen Shirt",
    description: "BELLSTONE Men Casual Woolen Shirt",
    category: "Men Shirt",
    subCategory: "Shirt",
    originalPrice: 2527,
    discount: 70,
    price: 758,
    imageUrl: "https://i.ibb.co/RZy6Tp5/mn10.png",
    inStock: true,
    color: "Green",
    size: "L, XL",
  },
  {
    name: "Kids Dungaree",
    description:
      "Dungaree For Baby Boys & Baby Girls Casual Checkered Cotton Blend",
    category: "Kids",
    subCategory: "Dungaree",
    originalPrice: 1299,
    discount: 20,
    price: 1039,
    imageUrl: "https://i.ibb.co/RGnn9RH9/kid22.png",
    inStock: true,
    color: "Black",
    size: "3 - 6 Years , 6 - 9 Years",
  },
  {
    name: "Women Kurta Pant with Dupatta",
    description: "Women Georgette Kurta Pant Dupatta Set",
    category: "Women Ethnic",
    subCategory: "Kurta",
    originalPrice: 758,
    discount: 70,
    price: 227,
    imageUrl: "https://i.ibb.co/gFvCcYRV/wmn10.png",
    inStock: true,
    color: "Maroon",
    size: "S , M",
  },
];

const getRandomProducts = (arr, count = 3) => {
  const copy = [...arr];
  const result = [];
  while (result.length < count && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
};

const Wishlist = () => {
  const navigate = useNavigate();
  const { addToCart, toastMessage, clearToast, showToast } = useCartWishlist();

  // Local state
  const [productsLoading, setProductsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [products, setProducts] = useState([]);
  const [inspiredProducts, setInspiredProducts] = useState([]);

  // Get wishlist and cart functions from context
  const {
    wishlist,
    toggleWishlist,
    addToCart: addToCartFromContext,
    isLoading: authLoading,
    initializeUserData,
  } = useContext(AuthContext);

  // Initialize wishlist data on mount
  useEffect(() => {
    initializeUserData();
  }, [initializeUserData]);

  // Set random inspired products on mount
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      setInspiredProducts(getRandomProducts(allProducts, 4));
    }
  }, []);

  // Fetch wishlist products directly from backend
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setProducts([]);
        setProductsLoading(false);
        return;
      }

      try {
        // Fetch only wishlist products from backend
        const wishlistRes = await api.get(
          "https://e-commerce-website-backend-d84m.onrender.com/api/wishlist",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // The backend should return wishlist with products array
        // If it returns product IDs, we'd need to fetch products separately
        const wishlistData = wishlistRes.data;

        if (wishlistData.products && Array.isArray(wishlistData.products)) {
          // Backend returns full product objects
          setProducts(wishlistData.products);
        } else if (
          wishlistData.wishlist &&
          Array.isArray(wishlistData.wishlist)
        ) {
          // If backend returns product IDs, we need to fetch full products
          // Fetch all products and filter by IDs
          const allProductsRes = await api.get(
            "https://e-commerce-website-backend-d84m.onrender.com/api/products",
          );
          const filtered = (allProductsRes.data || []).filter((p) =>
            wishlistData.wishlist.includes(p._id.toString()),
          );
          setProducts(filtered);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching wishlist products:", err);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    // Only fetch after auth has loaded
    if (!authLoading) {
      fetchWishlistProducts();
    }
  }, [authLoading]);

  // Use products directly (no filtering needed since backend returns wishlist products)
  const wishlistProducts = useMemo(() => {
    return products || [];
  }, [products]);

  // Remove item from wishlist
  const removeItem = async (id) => {
    try {
      await toggleWishlist(id, true);

      // ✅ REMOVE FROM UI IMMEDIATELY
      setProducts((prev) => prev.filter((item) => item._id !== id));

      showToast("❤️ Removed from wishlist");
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      showToast("❌ Error removing from wishlist");
      console.error("Wishlist error:", err);
    }
  };
  // Move product to cart
  const moveToCart = async (item) => {
    try {
      await addToCartFromContext(item._id);
      showToast("✅ Added to cart");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      showToast("❌ Error adding to cart");
      console.error("Cart error:", err);
    }
  };

  // Show loading while fetching
  if (productsLoading || authLoading) {
    return <Loading />;
  }

  const isEmpty = wishlistProducts.length === 0;

  return (
    <>
      <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />

      <div className="wishlist-container">
        <div className="wishlist-header">
          ❤️ My Wishlist ({wishlistProducts.length} items)
        </div>

        <div className="wishlist-page">
          {/* Left side: Wishlist items or empty state */}
          <div className="wishlist-left">
            {!isEmpty ? (
              wishlistProducts.map((item) => (
                <div className="wishlist-item" key={item._id}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="item-image"
                  />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="desc">{item.description}</p>
                    <div className="price">
                      {item.mrp && <span className="mrp">₹{item.mrp}</span>}
                      <span className="final">₹{item.price}</span>
                      {item.mrp && (
                        <span className="discount">
                          {Math.round((1 - item.price / item.mrp) * 100)}% off
                        </span>
                      )}
                    </div>
                    <div className="wishlist-actions">
                      <button
                        className="move-btn"
                        onClick={() => moveToCart(item)}
                      >
                        Move to Cart
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-wishlist">
                <div className="empty-wishlist-card">
                  <div className="wishlist-emoji">💖</div>
                  <h2 className="wishlist-title">Your wishlist is empty</h2>
                  <p className="wishlist-subtitle">
                    Save items you love. Build your personal collection. Come
                    back when inspiration hits.
                  </p>
                  <div className="wishlist-actions-empty">
                    <button
                      className="wishlist-primary-btn"
                      onClick={() => navigate("/Dashboard")}
                    >
                      Discover Products
                    </button>
                    <button
                      className="wishlist-secondary-btn"
                      onClick={() => navigate("/Redirect")}
                    >
                      Explore Categories
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right side: Trending picks */}
          <div className="wishlist-right">
            <h2
              style={{
                marginBottom: 40,
                color: "#ff4da6",
                fontWeight: "bold",
                fontFamily: "satisfy, cursive",
              }}
            >
              Trending Picks
            </h2>

            <div className="mini-stack">
              {inspiredProducts.map((item, idx) => (
                <div
                  key={idx}
                  className="mini-card"
                  onClick={() =>
                    navigate("/ProductDetails", {
                      state: { product: item, index: idx },
                    })
                  }
                >
                  <img src={item.imageUrl} alt={item.name} />
                  <div className="mini-info">
                    <p className="mini-name">{item.name}</p>
                    <p className="mini-price">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "black",
            color: "white",
            padding: "15px 20px",
            borderRadius: "6px",
            fontSize: "14px",
            zIndex: 9999,
            opacity: 0.9,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={clearToast}
            style={{
              border: "none",
              background: "transparent",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              marginRight: "15px",
            }}
          >
            ✖
          </button>
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};

export default Wishlist;
