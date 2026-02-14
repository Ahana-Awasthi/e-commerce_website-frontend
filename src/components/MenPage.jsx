import { useState, useEffect } from "react";
import "./FilterBar.css"; 
import FilterBar from "./FilterBar";

function MenPage() {
  const [menProducts, setMenProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/men")
      .then(res => res.json())
      .then(data => {
        setMenProducts(data);
        setFilteredProducts(data); // initially show all
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="d-flex">
      {/* FilterBar */}
      <FilterBar menProducts={menProducts} setFilteredProducts={setFilteredProducts} />

      {/* Product Grid */}
      <div className="card-grid-big">
        {filteredProducts.map(product => (
          <div key={product._id} className="product-card">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-image"
            />
            <div className="product-details">
              <h5 className="text-secondary my-3">{product.name}</h5>
              <span className="text-danger-emphasis">
                {product.description || ""}
              </span>
              <h6 className="fw-bold my-3 fs-5">
                ₹{product.price}
                <span className="text-body-tertiary mx-2">
                  <strike>₹{product.originalPrice}</strike>
                </span>
                <span className="text-success mx-2">
                  ({product.discount}% OFF)
                </span>
              </h6>
              <span className="text-body-tertiary fs-5">{product.color || ""}</span>
              <h6 className="my-2">Size : {product.size || ""}</h6>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenPage;


