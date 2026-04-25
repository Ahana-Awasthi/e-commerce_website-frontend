import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "./Nav";
import { useCartWishlist } from "../hooks/useCartWishlist";
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import "./theme.css";
import { m } from "framer-motion";

/* ---------- ImageWithFallback ---------- */
function ImageWithFallback({ src, alt, style }) {
  const [error, setError] = useState(false);
  return (
    <img
      src={error ? "https://placehold.co/400x550?text=Product+Image" : src}
      alt={alt}
      style={style}
      onError={() => setError(true)}
    />
  );
}

/* ---------- Button ---------- */
function Button({ children, variant = "default", style, ...props }) {
  const base = {
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  };
  const variants = {
    default: { background: "#000", color: "#fff" },
    outline: { background: "transparent", border: "2px solid #ddd" },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...style }} {...props}>
      {children}
    </button>
  );
}

/* ---------- Badge ---------- */
function Badge({ children, variant = "secondary" }) {
  const base = {
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 500,
    backgroundColor: "#d0b780b0",
    border: "1px solid #000",
  };
  const variants = {
    secondary: { background: "#ecfd67fc" },
    destructive: { background: "#ef4444", color: "#fff" },
  };
  return <span style={{ ...base, ...variants[variant] }}>{children}</span>;
}

/* ---------- Accordion ---------- */
const AccordionContext = React.createContext();
const AccordionItemContext = React.createContext();

function Accordion({ children }) {
  const [openItem, setOpenItem] = useState(null);
  return (
    <AccordionContext.Provider value={{ openItem, setOpenItem }}>
      {children}
    </AccordionContext.Provider>
  );
}

function AccordionItem({ children, value }) {
  return (
    <AccordionItemContext.Provider value={value}>
      <div style={{ borderBottom: "1px solid #e5e5e5" }}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

function AccordionTrigger({ children }) {
  const { openItem, setOpenItem } = useContext(AccordionContext);
  const value = useContext(AccordionItemContext);
  const isOpen = openItem === value;
  return (
    <button
      onClick={() => setOpenItem(isOpen ? null : value)}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        padding: "16px 0",
        border: "none",
        background: "transparent",
        cursor: "pointer",
      }}
    >
      {children}
      <ChevronDown
        style={{
          transform: isOpen ? "rotate(180deg)" : "rotate(0)",
          transition: "0.3s",
        }}
      />
    </button>
  );
}

function AccordionContent({ children }) {
  const { openItem } = useContext(AccordionContext);
  const value = useContext(AccordionItemContext);
  const isOpen = openItem === value;
  return (
    <div
      style={{
        maxHeight: isOpen ? "500px" : "0",
        overflow: "hidden",
        transition: "0.3s",
      }}
    >
      {isOpen && <div style={{ paddingBottom: 16 }}>{children}</div>}
    </div>
  );
}

/* ---------- MAIN PRODUCT COMPONENT ---------- */
export default function ProductDetails() {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, toastMessage, clearToast } =
    useCartWishlist();
  const location = useLocation();
  const index = location.state?.index ?? 0;
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const defaultProduct = {
    index: 0,
    name: "Product Name",
    price: " Product Price",
    originalPrice: " Product Original Price",
    discount: "Product Discount ",
    size: "S,M,L", // comma-separated string
    color: ["Red", "Green", "Blue"], // optional
    imageUrl: "https://placehold.co/400x600?text=Product+Image&font=montserrat",
    description: "This is a default product description.",
  };
  const [searchInput, setSearchInput] = useState("");

  let product = location.state?.product || defaultProduct;
  const rating = (index % 5) + 1;

  if (!product) {
    // fetch the product by id from your data source
    product = allProducts.find((p) => p.id === id);
  }
  console.log("Location object:", location);
  const [selectedSize, setSelectedSize] = useState(
    product.size?.split(",")[0] || "",
  );
  // Ensure colors is always an array of { name, value } objects
  const colors = Array.isArray(product.color)
    ? product.color.map((c) => ({
        name: c,
        value: typeof c === "string" ? c.toLowerCase() : "",
      }))
    : product.color
      ? [{ name: product.color, value: product.color.toLowerCase() }]
      : [];

  // Initialize selectedColor safely
  const [selectedColor, setSelectedColor] = useState(
    colors.length > 0 ? colors[0] : null,
  );
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const sizes = product.size ? product.size.split(",") : ["S", "M", "L"];

  return (
    <>
      <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "40px",
            alignItems: "start",
          }}
        >
          {/* IMAGE SECTION */}
          <div style={{ width: "100%" }}>
            <ImageWithFallback
              src={product.imageUrl}
              alt="Product Image"
              style={{
                width: "100%",
                maxWidth: "450px",
                height: "auto",
                borderRadius: 12,
                border: "2px solid #000",
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>

          {/* PRODUCT INFO */}
          <div style={{ width: "100%" }}>
            <Badge>New Arrival</Badge>

            <h1
              style={{ fontSize: "clamp(22px, 3vw, 32px)", margin: "16px 0" }}
            >
              {product.name}
            </h1>

            {/* RATING */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} fill={i < rating ? "#facc15" : "none"} />
              ))}
            </div>

            {/* PRICE */}
            <div
              style={{
                margin: "20px 0",
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 26 }}>₹{product.price}</span>

              {product.originalPrice && (
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "#888",
                  }}
                >
                  ₹{product.originalPrice}
                </span>
              )}

              {product.discount && <Badge>{product.discount}% OFF</Badge>}
            </div>

            {/* COLORS */}
            {product.color && colors.length > 0 && (
              <>
                <p>Color: {selectedColor?.name}</p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        backgroundColor: c.value || "#fff",
                        border:
                          selectedColor?.name === c.name
                            ? "3px solid #000"
                            : "1px solid #ccc",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              </>
            )}

            {/* SIZE */}
            <p>Select Size</p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginBottom: 20,
              }}
            >
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    background: selectedSize === s ? "#000" : "#fff",
                    color: selectedSize === s ? "#fff" : "#000",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <Button
                style={{ flex: "1 1 200px" }}
                disabled={!selectedSize}
                onClick={() =>
                  addToCart(product._id || product.id, setCart, navigate)
                }
              >
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </Button>

              <Button
                variant="outline"
                style={{
                  border: wishlist.includes(product._id || product.id)
                    ? "3px solid #000"
                    : "2px solid grey",
                }}
                onClick={() =>
                  toggleWishlist(
                    product._id || product.id,
                    wishlist.includes(product._id || product.id),
                    setWishlist,
                    navigate,
                  )
                }
              >
                <Heart
                  fill={
                    wishlist.includes(product._id || product.id)
                      ? "black"
                      : "none"
                  }
                />
              </Button>
            </div>

            {/* ACCORDION */}
            <div style={{ marginTop: 30 }}>
              <Accordion>
                <AccordionItem value="desc">
                  <AccordionTrigger>
                    Description & Specifications
                  </AccordionTrigger>
                  <AccordionContent>
                    {product.description || "No description available"}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* FEATURES */}
            <div style={{ marginTop: 30, display: "grid", gap: 10 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <Truck size={18} /> Free Shipping
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <RotateCcw size={18} /> Easy Returns
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Shield size={18} /> Secure Payment
              </div>
            </div>
          </div>
        </div>
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
