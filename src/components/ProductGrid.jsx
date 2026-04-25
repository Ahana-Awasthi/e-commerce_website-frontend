import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Carousel.css";
import nobg from "../assets/nobg.png";

function ProductGrid() {
  const [products] = useState([
    {
      _id: 1,
      name: "Men Regular Fit T-shirt",
      description: "POLO Men Regular Fit T-shirt",
      subCategory: "T-Shirt",
      category: "Men Shirt",
      originalPrice: 1800,
      discount: 70,
      price: 540,
      imageUrl: "https://i.ibb.co/Mx1crThr/mn1.png",
      inStock: true,
      color: "Green",
      size: "M, L",
      style: { width: "230px", marginLeft: 40 },
    },
    {
      _id: 2,
      name: "Women Floral Print Casual Long Maxi Dress",
      description: "Women Solid White With Floral Print Casual Long Maxi Dress",
      category: "Women Western",
      subCategory: "Maxi Dresses",
      originalPrice: 756,
      discount: 35,
      price: 491,
      imageUrl: "https://i.ibb.co/TMgjzdc5/wmn7.png",
      inStock: false,
      color: " White ",
      size: "S , M , L , XL",
    },
    {
      _id: 3,
      name: "Men Solid Collar T-Shirt",
      description: "POLO Men Solid Collar T-Shirt",
      category: "Men Shirt",
      subCategory: "T-Shirt",
      originalPrice: 1150,
      discount: 40,
      price: 690,
      imageUrl: "https://i.ibb.co/1t5mfsVC/mn2.png",
      inStock: true,
      color: "Black",
      size: "S, M",
    },

    {
      _id: 4,
      name: "Women Wide Leg Stretchable Jeans",
      description: "Women Loose Fit High Rise Wide Leg Stretchable Jeans",
      category: "Women Western",
      subCategory: "Jeans",
      originalPrice: 1436,
      discount: 60,
      price: 574,
      imageUrl: "https://i.ibb.co/ds76qx1K/wmn8.png",
      inStock: true,
      color: " Black ",
      size: "S , M , L",
    },
  ]);
  const navigate = useNavigate();
  const tags = [
    "Hot Deal",
    "Limited Offer",
    "Best Seller",
    "Flash Sale",
    "Trending",
    "New Arrival",
    "Exclusive",
  ];

  return (
    <div className="card-section">
      <h1 className="fredericka-the-great-regular text-center mt-5">
        Trade Up Your Wardrobe
      </h1>

      <div className="card-grid">
        {products.length === 0 ? (
          <p>Loading products...</p>
        ) : (
          products.slice(0, 6).map((product, index) => {
            const randomTag = tags[Math.floor(Math.random() * tags.length)];
            return (
              <div
                key={product._id || index}
                className="product-card"
                onClick={() =>
                  navigate("/ProductDetails", { state: { product, index } })
                }
                style={{ cursor: "pointer" }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ minWidth: "260px" }}
                  className="product-image"
                />
                <div className="product-details">
                  <h5 className="text-secondary">{product.name}</h5>
                  <span className="text-danger-emphasis">
                    {product.description || ""}
                  </span>
                  <h6 className="fw-bold">
                    ₹{product.price}
                    <span className="text-body-tertiary mx-2">
                      <strike>₹{product.originalPrice}</strike>
                    </span>
                    <span className="text-success">
                      ({product.discount}% OFF)
                    </span>
                  </h6>

                  <br />
                  <span className="text-body-tertiary">
                    {product.color || "Product Color"}{" "}
                  </span>
                  <h6 className="my-2">Size : {product.size || ""}</h6>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="broad my-5">
        <img src={nobg} alt="" className="broad-img" />
        <div className="hero-text">
          <h1>UNLEASH POWER</h1>
          <h3 className="my-3 fw-normal me-5 pe-4">MOVE WITH PURPOSE</h3>
          <div className="me-5 pe-5">
            <button
              className="home-btn-cta fw-bold me-4"
              onClick={() => navigate("/Redirect")}
            >
              SHOP NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductGrid;
