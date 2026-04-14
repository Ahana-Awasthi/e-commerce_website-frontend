import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./Nav";
import Loading from "./Loading";
import "./Cart.css";
import api from "../api/axios";
import popSound from "../assets/popping-sound.mp3";
import { AuthContext } from "../context/AuthContext";

export default function Cart() {
  const hoverSoundRef = useRef(null);

  useEffect(() => {
    hoverSoundRef.current = new Audio(popSound);
    hoverSoundRef.current.volume = 1;
  }, []);
  const navigate = useNavigate();
  const playSound = () => {
    const audio = hoverSoundRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio.volume = 1;

    // fake louder perception
    audio.play();
    audio.play().catch(() => {});
  };
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    isLoading,
    initializeUserData,
  } = useContext(AuthContext);
  const [searchInput, setSearchInput] = useState("");
  const [products, setProducts] = useState([]); // all products from backend
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRes = await api.get(
          "https://e-commerce-website-backend-d84m.onrender.com/api/products",
        );
        setProducts(productsRes.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Refresh cart data when component mounts
  useEffect(() => {
    initializeUserData();
  }, [initializeUserData]);

  // Map cart data to product objects with quantities
  const cartProducts = products
    .filter((p) => {
      const productId = p._id.toString();
      return cart.some((item) => {
        if (Array.isArray(item) && item.length >= 2) {
          return item[0] === productId;
        }
        return false;
      });
    })
    .map((p) => {
      const productId = p._id.toString();
      const cartItem = cart.find(
        (item) => Array.isArray(item) && item[0] === productId,
      );
      const qty = cartItem ? parseInt(cartItem[1]) || 1 : 1;
      return {
        ...p,
        qty,
      };
    });

  const updateQty = async (id, newQty) => {
    if (newQty < 1) return;
    try {
      await updateCartQuantity(id, newQty);
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const removeItem = async (id) => {
    try {
      await removeFromCart(id);
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const total = cartProducts.reduce((t, p) => t + p.price * p.qty, 0);

  if (loading) return <Loading />;

  return (
    <div className="fancy-cart">
      <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />
      <h1 className="title">My Cart</h1>

      <div className="cart-layout">
        <div className="cart-left">
          {cartProducts.length > 0 ? (
            cartProducts.map((item) => (
              <>
                <div className="cart-row" key={item._id}>
                  <div className="left">
                    <img
                      src={item.imageUrl || "/placeholder.png"}
                      alt={item.name}
                    />
                    <div className="info">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>

                  <div className="right">
                    <div className="row1">
                      <div className="price">Price: ₹{item.price}</div>
                      <div className="qty">
                        <button
                          onClick={() => updateQty(item._id, item.qty - 1)}
                        >
                          -
                        </button>
                        <span>{item.qty}</span>
                        <button
                          onClick={() => updateQty(item._id, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="row2">
                      <div className="total">
                        Total: ₹{item.price * item.qty}
                      </div>
                      <button
                        className="remove"
                        onClick={() => removeItem(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ))
          ) : (
            <>
              <div className="empty-cart">
                <div className="empty-illustration" onMouseEnter={playSound}>
                  🛒
                </div>

                <h2 className="empty-title">Your cart is empty</h2>

                <p className="empty-subtitle">
                  Looks like you haven’t added anything yet. Let’s fix that.
                </p>

                <div className="empty-actions">
                  <button
                    className="shop-now-btn"
                    onClick={() => navigate("/Dashboard")}
                  >
                    Start Shopping
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() => navigate("/Redirect")}
                  >
                    Explore Categories
                  </button>
                </div>
              </div>
            </>
          )}
          {cartProducts.length > 0 && (
            <>
              <div className="cart-total">Cart Total : ₹{total}</div>
              <button
                className="order-btn"
                onClick={() => navigate("/checkout")}
              >
                Place Order
              </button>
            </>
          )}
        </div>

        <div className="cart-right">
          <h2>Top Picks</h2>
          <div className="divider"></div>
          <button className="pick" onClick={() => navigate("/Shop/Home")}>
            Home Decor
          </button>

          <button className="pick" onClick={() => navigate("/Shop/Beauty")}>
            Beauty Studio
          </button>

          <button
            className="pick"
            onClick={() => navigate("/Shop/Electronics")}
          >
            Tech Hub
          </button>
        </div>
      </div>
    </div>
  );
}
