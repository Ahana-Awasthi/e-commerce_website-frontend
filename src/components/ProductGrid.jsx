import React, { useEffect, useState } from "react";
import "./Carousel.css";
import nobg from "../assets/nobg.png";

function ProductGrid() {
  const [products, setProducts] = useState([]);
  const tags = ["Hot Deal", "Limited Offer", "Best Seller", "Flash Sale", "Trending", "New Arrival", "Exclusive"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
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
              <div key={product._id || index} className="product-card">
                <img src={`http://localhost:3000${product.imageUrl}`} alt={product.name} className="product-image" />
                <div className="product-details">
                  <h5 className="text-secondary">{product.name}</h5>
                  <span className="text-danger-emphasis">{product.description || ""}</span>
                  <h6 className="fw-bold">
                    ₹{product.price}
                    <span className="text-body-tertiary mx-2">
                      <strike>₹{product.originalPrice}</strike>
                    </span>
                    <span className="text-success">({product.discount}% OFF)</span>
                  </h6>
                  <span className="badge text-bg-success my-2 p-2">{randomTag}</span><br />
                  <span className="text-body-tertiary">{product.color || ""} </span>
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
            <a href="#" className="home-btn-cta fw-bold me-4">SHOP NOW</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductGrid;


