import { useState, useEffect } from "react";
import "./FilterBar.css"; 
import FilterBar from "./FilterBar";
import { WomenProducts as WomenData } from "../data/seedProductsWomen"; // rename import

function WomenPage() {
  const [womenProducts, setWomenProducts] = useState([]); // lowercase for state
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    try {
      setWomenProducts(WomenData); // use the imported data
      setFilteredProducts(WomenData); // initially show all
    } catch (err) {
      console.error("Error loading women products:", err);
    }
  }, []);

  return (
    <div className="d-flex">
      <FilterBar 
        products={womenProducts} 
        setFilteredProducts={setFilteredProducts} 
        category="Women"
      />

      <div className="card-grid-big">
        {filteredProducts.map((product, index) => (
          <div key={index} className="product-card">
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

export default WomenPage;
