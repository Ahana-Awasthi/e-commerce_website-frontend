import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "./Nav";
import { useCartWishlist } from "../hooks/useCartWishlist";
import "./Dashboard.css";

/* Product Images */
import img1 from "../assets/product1.webp";
import img2 from "../assets/product2.webp";
import img3 from "../assets/product3.webp";
import img4 from "../assets/product4.webp";
import img5 from "../assets/product5.webp";
import img6 from "../assets/product6.webp";
import img7 from "../assets/product7.webp";
import img8 from "../assets/product8.webp";
import img9 from "../assets/product9.webp";
import img10 from "../assets/product10.webp";
import img11 from "../assets/product11.webp";
import img12 from "../assets/product12.webp";
import img13 from "../assets/product13.webp";
import img14 from "../assets/product14.webp";
import img15 from "../assets/product15.webp";
import img16 from "../assets/product16.webp";
import Dash_carousel from "./Dash_carousel";
import DealBanner from "./DealBanner";

export default function Dashboard() {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, toastMessage, clearToast } =
    useCartWishlist();
  const [searchInput, setSearchInput] = useState("");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const recommended = [
    {
      id: 1,
      img: img10,
      name: "Casual Party Shirt",
      desc: "Stylish design with soft fabric",
      price: "₹899",
      navigate: "Men?fullQuery=men%20shirts&searchQuery=shirts",
    },
    {
      id: 2,
      img: img11,
      name: "Perfect Radiance Cream",
      desc: "Lightweight daily moisturizer",
      price: "₹999",
      navigate: "Beauty?fullQuery=beauty%20cream&searchQuery=cream",
    },
    {
      id: 3,
      img: img3,
      name: "Hydrating Face Cream",
      desc: "72-hour moisture for glowing skin",
      price: "₹249",
      navigate: "Beauty?fullQuery=beauty%20cream&searchQuery=cream",
    },
    {
      id: 4,
      img: img16,
      name: "Wireless Bluetooth Earbuds",
      desc: "Noise reduction with long battery life",
      price: "₹785",
      navigate: "Electronics",
    },
  ];

  const newArrivals = [
    {
      id: 5,
      img: img1,
      name: "Fit and Flare Dress",
      desc: "Breathable fabric with elegant design",
      price: "₹365",
      navigate: "Women?fullQuery=women+dress&searchQuery=dress",
    },
    {
      id: 6,
      img: img6,
      name: "Kids Cotton T-Shirt",
      desc: "Soft fabric for all-day comfort",
      price: "₹215",
      navigate: "Kids?fullQuery=kids+t-shirt&searchQuery=t-shirt",
    },
    {
      id: 7,
      img: img7,
      name: "Luxury Bed Sheet Set",
      desc: "Premium cotton with modern prints",
      price: "₹425",
      navigate: "Home",
    },
    {
      id: 8,
      img: img8,
      name: "Casual Check Shirt",
      desc: "Perfect for everyday styling",
      price: "₹350",
      navigate: "Men?fullQuery=men+shirt&searchQuery=shirt",
    },
  ];

  const bestSellers = [
    {
      id: 9,
      img: img9,
      name: "Designer Shoulder Bag",
      desc: "Premium leather with modern finish",
      price: "₹578",
      navigate: "Beauty?fullQuery=beauty+bag&searchQuery=bag",
    },
    {
      id: 10,
      img: img5,
      name: "Polyester Window Curtains",
      desc: "Semi-transparent elegant curtain set",
      price: "₹545",
      navigate: "Home?fullQuery=home+curtains&searchQuery=curtains",
    },
    {
      id: 11,
      img: img4,
      name: "Luxury Lipstick Combo",
      desc: "Matte shades with long-lasting formula",
      price: "₹379",
      navigate: "Beauty?fullQuery=beauty+lipstick&searchQuery=lipstick",
    },
    {
      id: 12,
      img: img12,
      name: "Classic Silver Watch",
      desc: "Minimal dial with stainless steel strap",
      price: "₹1500",
      navigate: "Electronics",
    },
  ];

  const youMayLike = [
    {
      id: 13,
      img: img13,
      name: "Men's Cargo Pants",
      desc: "Relaxed fit with utility pockets",
      price: "₹349",
      navigate: "Men?fullQuery=men+pants&searchQuery=pants",
    },
    {
      id: 14,
      img: img14,
      name: "White Block Heels",
      desc: "Elegant heels with comfortable grip",
      price: "₹499",
      navigate: "Women",
    },
    {
      id: 15,
      img: img15,
      name: "Baby Party Dress",
      desc: "Soft cotton dress for special occasions",
      price: "₹345",
      navigate: "Kids",
    },
    {
      id: 16,
      img: img2,
      name: "Women's Co-ord Set",
      desc: "Comfortable matching outfit for daily wear",
      price: "₹406",
      navigate: "Women?fullQuery=women+combos&searchQuery=combos",
    },
  ];

  return (
    <>
      <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />

      <div className="dashboard container-fluid py-4 px-4">
        {/* Header */}
        <div className="text-center mb-4 hero-header">
          <h2 className="hero-main-title">Discover Your Style</h2>
          <p className="vibe-border hero-tagline">Your Vibe. Your Store</p>
        </div>

        {/* Carousel */}
        <div className="mb-5">
          <Dash_carousel />
        </div>

        {/* Sections */}
        <Section
          title="Recommended for You"
          products={recommended}
          addToCart={addToCart}
          toggleWishlist={toggleWishlist}
          setCart={setCart}
          setWishlist={setWishlist}
          navigate={navigate}
          wishlist={wishlist}
        />

        <Section
          title="New Arrivals"
          products={newArrivals}
          addToCart={addToCart}
          toggleWishlist={toggleWishlist}
          setCart={setCart}
          setWishlist={setWishlist}
          navigate={navigate}
          wishlist={wishlist}
        />

        {/* Deal Banner */}
        <div className="my-5">
          <DealBanner />
        </div>

        <Section
          title="Best Sellers"
          products={bestSellers}
          addToCart={addToCart}
          toggleWishlist={toggleWishlist}
          setCart={setCart}
          setWishlist={setWishlist}
          navigate={navigate}
          wishlist={wishlist}
        />

        <Section
          title="You May Also Like"
          products={youMayLike}
          addToCart={addToCart}
          toggleWishlist={toggleWishlist}
          setCart={setCart}
          setWishlist={setWishlist}
          navigate={navigate}
          wishlist={wishlist}
        />
      </div>

      {/* TOAST NOTIFICATION */}
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
}

/* Reusable Section */

function Section({
  title,
  products,
  addToCart,
  toggleWishlist,
  setCart,
  setWishlist,
  navigate,
  wishlist,
}) {
  return (
    <div className="product-section mb-4">
      <h5 className="mb-3 fw-bold text-uppercase section-title">{title}</h5>

      <div className="row">
        {products.map((item) => (
          <div
            key={item.id}
            className="col-9 col-md-3 mb-4 dashboard-cards-container"
          >
            <div className="product-cards-dashboard">
              {/* Image */}
              <div className="product-image-box">
                <img src={item.img} alt={item.name} />
              </div>

              {/* Info */}
              <div className="mt-2 text-center">
                <h6 className="fw-semibold mb-1">{item.name}</h6>

                <p className="text-secondary small mb-1">{item.desc}</p>

                <p className="price mb-2">{item.price}</p>
              </div>

              {/* Buttons */}
              <div className="d-flex gap-2 justify-content-center">

                <button
                  className="btn btn-outline-primary btn-sm w-100"
                  onClick={() => navigate(`/Shop/${item.navigate}`)}
                >
                  View Products
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
