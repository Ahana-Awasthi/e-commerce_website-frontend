// src/components/Shop.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./Dashboard.css";
import FilterBar from "./FilterBar";
import Loading from "./Loading";
import NavBar from "./Nav";

function ProductImage({ src, alt }) {
  const [imgSrc, setImgSrc] = useState(src);
  const placeholder = "https://placehold.co/160x250?text=Loading...";

  return (
    <img
      src={imgSrc}
      alt={alt}
      className="product-image"
      style={{ width: "230px" }}
      onError={() => setImgSrc(placeholder)}
      loading="lazy"
    />
  );
}

function Shop() {
  const { type } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [noProductsReason, setNoProductsReason] = useState("");
  const [frozenQuery, setFrozenQuery] = useState("your search");
  const [isFilterActive, setIsFilterActive] = useState(false);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2000); // hide after 2s
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://e-commerce-website-backend-d84m.onrender.com/api/wishlist", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // backend returns array of products
        if (data.wishlist) {
          setWishlist(data.wishlist.map((p) => p._id || p));
        }
      })
      .catch((err) => console.error("Failed to fetch wishlist:", err));
  }, []);
  const category = type?.toLowerCase() === "all" ? null : type?.toLowerCase();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://e-commerce-website-backend-d84m.onrender.com/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.cart) {
          setCart(
            data.cart.map((item) =>
              Array.isArray(item) ? item : [item._id || item, "1"],
            ),
          );
        }
      })
      .catch((err) => console.error("Failed to fetch cart:", err));
  }, []);
  // 1️⃣ Fetch all products
  useEffect(() => {
    setLoading(true);
    fetch(`https://e-commerce-website-backend-d84m.onrender.com/api/${category}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched products:", data); // <--- add this
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        if (type && type !== "all") navigate("/"); // invalid category fallback
      });
  }, [navigate, type, category]);

  // 2️⃣ Parse search query from URL
  const searchArray = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("searchQuery") || "";
    return query.trim().split(/\s+/).filter(Boolean);
  }, [location.search]);

  const fullQueryFromURL = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("fullQuery") || params.get("searchQuery") || "";
  }, [location.search]);

  useEffect(() => {
    setSearchInput(fullQueryFromURL);
  }, [fullQueryFromURL]);

  // 3️⃣ Products in current category (robust filtering)
  const productsInCategory = useMemo(() => {
    if (!products) return [];
    if (!category) return products; // show all
    const normalizedCat = category.toLowerCase();
    return products.filter((p) => {
      const cat = String(p.category || p.subCategory || "").toLowerCase();
      return cat.includes(normalizedCat);
    });
  }, [products, category]);

  // 4️⃣ Initialize filteredProducts to productsInCategory
  // ONLY if no active search/filter to avoid overwriting FilterBar results
  useEffect(() => {
    const noActiveSearch = searchArray.length === 0 && !isFilterActive;
    if (noActiveSearch) {
      setFilteredProducts(productsInCategory);
    }
  }, [productsInCategory, searchArray, isFilterActive]);

  // 5️⃣ Frozen query logic
  useEffect(() => {
    if (filteredProducts.length === 0 && frozenQuery === "") {
      setFrozenQuery(searchInput);
    }
  }, [filteredProducts, searchInput]);

  // 6️⃣ No products reason
  useEffect(() => {
    if (filteredProducts.length === 0) {
      if (searchArray.length > 0 || isFilterActive)
        setNoProductsReason("search");
      else setNoProductsReason("");
    } else {
      setNoProductsReason("");
    }
  }, [filteredProducts, searchArray, isFilterActive]);

  if (loading) return <Loading />;

  // Only show all products if no search/filter is active
  const hasActiveSearch = searchArray.length > 0 || isFilterActive;
  const productsToDisplay =
    filteredProducts.length > 0
      ? filteredProducts
      : hasActiveSearch
        ? [] // Show empty if search/filter is active but no results
        : productsInCategory; // Show all products if no search/filter
  const HeartOutline = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );

  const HeartFilled = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="red"
      stroke="red"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );

  const CartIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ marginRight: 10, marginBottom: 2 }}
    >
      <path
        d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 
    0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 
    2-2-.9-2-2-2zM7.16 14h9.45c.75 0 
    1.41-.41 1.75-1.03l3.58-6.49A1 
    1 0 0 0 21 5H5.21l-.94-2H1v2h2l3.6 
    7.59-1.35 2.44C4.52 15.37 5.48 17 
    7 17h12v-2H7l1.16-2z"
      />
    </svg>
  );

  return (
    <>
      <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />

      <div className="d-flex">
        <FilterBar
          category={type}
          products={productsInCategory}
          setFilteredProducts={setFilteredProducts}
          searchArray={searchArray}
          setNoProductsReason={setNoProductsReason}
          setIsFilterActive={setIsFilterActive}
        />

        <div className="card-grid-big">
          {productsToDisplay.length > 0 ? (
            productsToDisplay.map((product, index) => (
              <div
                key={product._id || index}
                className="product-card-container"
                style={{ position: "relative" }}
              >
                {/* Wishlist Button - Top Right */}
                <button
                  className="wishlist-btn"
                  style={{
                    position: "absolute",
                    top: "40px",
                    left: "200px",
                    zIndex: 10,
                    borderRadius: "60%",
                    padding: "7px",
                    width: "45px",
                    background: "white",
                  }}
                  onClick={async (e) => {
                    e.stopPropagation();

                    const token = localStorage.getItem("token");
                    if (!token) {
                      navigate("/login");
                      return;
                    }

                    const isWishlisted = wishlist.includes(product._id);

                    try {
                      console.log(
                        `${isWishlisted ? "Removing" : "Adding"} product ${product._id} from wishlist`,
                      );

                      const res = await fetch(
                        "https://e-commerce-website-backend-d84m.onrender.com/api/wishlist",
                        {
                          method: isWishlisted ? "DELETE" : "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({ productId: product._id }),
                        },
                      );

                      const data = await res.json();
                      console.log(
                        "Wishlist response:",
                        data,
                        "Status:",
                        res.status,
                      );

                      if (res.ok) {
                        if (isWishlisted) {
                          showToast("Removed from wishlist");
                          setWishlist(
                            (prev) => prev.filter((id) => id !== product._id),
                            window.dispatchEvent(new Event("wishlistUpdated")),
                          );
                          console.log("Product removed from wishlist");
                        } else {
                          showToast("Added to wishlist");
                          setWishlist((prev) => [...prev, product._id]);
                          console.log("Product added to wishlist");
                          window.dispatchEvent(new Event("wishlistUpdated"));
                        }
                      } else {
                        console.error(
                          "Failed to update wishlist:",
                          data.message || data,
                        );
                        alert(
                          "Failed to update wishlist: " +
                            (data.message || "Unknown error"),
                        );
                      }
                    } catch (err) {
                      console.error("Wishlist error:", err);
                      alert("Error updating wishlist: " + err.message);
                      showToast("Error updating wishlist");
                    }
                  }}
                >
                  {wishlist.includes(product._id) ? HeartFilled : HeartOutline}
                </button>

                <div
                  className="product-card"
                  onClick={() =>
                    navigate("/ProductDetails", { state: { product, index } })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <ProductImage src={product.imageUrl} alt={product.name} />

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
                      {product.color || ""}
                    </span>

                    <h6 className="my-2">Size: {product.size || ""}</h6>

                    {/* Add to Cart Button */}
                    <button
                      className="btn btn-primary add-cart-btn mt-2"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const token = localStorage.getItem("token");
                        if (!token) {
                          navigate("/login");
                          return;
                        }

                        const productId = product._id;

                        try {
                          // Always call POST /cart — backend handles "already in cart" by incrementing quantity
                          const res = await fetch(
                            "https://e-commerce-website-backend-d84m.onrender.com/api/cart",
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({ productId }),
                            },
                          );

                          const data = await res.json();

                          if (res.ok) {
                            showToast("Added to cart");
                            // Optimistic frontend update
                            setCart((prev) => {
                              const safePrev = Array.isArray(prev) ? prev : [];
                              const existing = safePrev.find(
                                (item) => item[0] === productId,
                              );
                              let newCart;
                              if (existing) {
                                newCart = safePrev.map((item) =>
                                  item[0] === productId
                                    ? [item[0], String(Number(item[1]) + 1)]
                                    : item,
                                );
                              } else {
                                newCart = [...safePrev, [productId, "1"]];
                              }
                              window.dispatchEvent(new Event("cartUpdated"));
                              return newCart;
                            });

                            console.log(
                              "✅ Product added or quantity incremented:",
                              productId,
                            );
                          } else {
                            console.error(
                              "Cart update failed:",
                              data.message || data,
                            );
                            alert(
                              "Failed to update cart: " +
                                (data.message || "Try again"),
                            );
                          }
                        } catch (err) {
                          console.error("Cart error:", err);
                          alert("Error updating cart: " + err.message);
                        }
                      }}
                    >
                      {CartIcon} Add to Cart
                    </button>
                  </div>
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
          {" "}
          <button
            onClick={() => setToastMessage("")}
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

export default Shop;
