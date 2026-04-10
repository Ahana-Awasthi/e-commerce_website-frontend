import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";
import FilterBar from "./FilterBar";
import Loading from "./Loading";
import NavBar from "./Nav";

function KidsPage() {
  const [kidsProducts, setKidsProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [noProductsReason, setNoProductsReason] = useState("");
  const [frozenQuery, setFrozenQuery] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Load kids products
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/api/kids")
      .then((res) => res.json())
      .then((data) => {
        const kidsOnly = data.filter((p) =>
          String(p.category).toLowerCase().startsWith("kids"),
        );
        setKidsProducts(kidsOnly);
        setFilteredProducts(kidsOnly);
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

  // Sync search input
  useEffect(() => {
    setSearchInput(fullQueryFromURL);
  }, [fullQueryFromURL]);

  // Frozen query logic
  useEffect(() => {
    if (filteredProducts.length === 0 && frozenQuery === "") {
      setFrozenQuery(searchInput);
    } else if (filteredProducts.length > 0 && frozenQuery !== "") {
      setFrozenQuery("");
    }
  }, [filteredProducts, searchInput]);

  // No products reason
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
          products={kidsProducts}
          setFilteredProducts={setFilteredProducts}
          category="Kids"
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
                    ₹{product.price}
                    <span className="text-body-tertiary mx-2">
                      <strike>₹{product.originalPrice}</strike>
                    </span>
                    <span className="text-success mx-2">
                      ({product.discount}% OFF)
                    </span>
                  </h6>

                  <span className="text-body-tertiary fs-5">
                    {Array.isArray(product.color)
                      ? product.color.join(", ")
                      : product.color || ""}
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
                <>No products match the selected filters. Try adjusting them.</>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default KidsPage;
