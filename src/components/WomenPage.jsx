// src/components/WomenPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";
import FilterBar from "./FilterBar";
import Loading from "./Loading";
import NavBar from "./Nav";

function WomenPage() {
  const [womenProducts, setWomenProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [noProductsReason, setNoProductsReason] = useState("");
  const [frozenQuery, setFrozenQuery] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Load women products
  useEffect(() => {
    setLoading(true);
    fetch("https://e-commerce-website-backend-d84m.onrender.com/api/women")
      .then((res) => res.json())
      .then((data) => {
        const womenOnly = data.filter((p) =>
          String(p.subCategory)
        );
        setWomenProducts(womenOnly);
        setFilteredProducts(womenOnly);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Parse search query from URL
  const searchArray = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("searchQuery") || "";
    return query.trim().split(/\s+/).filter(Boolean);
  }, [location.search]);

  const fullQueryFromURL = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("fullQuery") || params.get("searchQuery") || "";
  }, [location.search]);

  // Keep searchInput in sync
  useEffect(() => {
    setSearchInput(fullQueryFromURL);
  }, [fullQueryFromURL]);

  // Handle frozenQuery for "No products found for X" message
  useEffect(() => {
    if (filteredProducts.length === 0 && frozenQuery === "") {
      setFrozenQuery(searchInput);
    } else if (filteredProducts.length > 0 && frozenQuery !== "") {
      setFrozenQuery("");
    }
  }, [filteredProducts, searchInput]);

  // Update noProductsReason dynamically
  useEffect(() => {
    if (filteredProducts.length === 0) {
      if (searchArray.length > 0) setNoProductsReason("search");
      else setNoProductsReason("filter");
    } else {
      setNoProductsReason("");
    }
  }, [filteredProducts, searchArray]);

  if (loading) return <Loading />;

  return (
    <>
      <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />

      <div className="d-flex">
        <FilterBar
          products={womenProducts}
          setFilteredProducts={setFilteredProducts}
          category="Women"
          searchArray={searchArray}
          setNoProductsReason={setNoProductsReason} 
        />

        <div className="card-grid-big">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
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
                  className="product-image"
                  style={{ width: "250px", marginLeft: -8 }}
                />
                <div className="product-details">
                  <h5 className="text-secondary my-3">{product.name}</h5>
                  <span className="text-danger-emphasis">
                    {product.description || ""}
                  </span>
                  <h6 className="fw-bold my-3 fs-5">
                    ₹{product.price}{" "}
                    <span className="text-body-tertiary mx-2">
                      <strike>₹{product.originalPrice}</strike>
                    </span>
                    <span className="text-success mx-2">
                      ({product.discount}% OFF)
                    </span>
                  </h6>
                  <span className="text-body-tertiary fs-5">
                    {product.color || ""}
                  </span>
                  <h6 className="my-2">Size: {product.size || ""}</h6>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products-message">
              {noProductsReason === "search" ? (
                <>
                  No products found for "<strong>{frozenQuery}</strong>". Try
                  searching with other keywords.
                </>
              ) : (
                <>
                  No products match the selected filters selected. Try adjusting
                  them.
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default WomenPage;
