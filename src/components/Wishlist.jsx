import React, { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import Loading from "./Loading";
import NavBar from "./Nav";
import { useNavigate } from "react-router-dom";
import { useCartWishlist } from "../hooks/useCartWishlist";
import { AuthContext } from "../context/AuthContext";
import "./Wishlist.css";
const allProducts = [
  {
    name: "Women Wide Leg Stretchable Jeans",
    description: "Women Loose Fit High Rise Wide Leg Stretchable Jeans",
    category: "Women Western",
    subCategory: "Jeans",
    originalPrice: 1436,
    discount: 60,
    price: 574,
    imageUrl: "https://i.ibb.co/ds76qx1K/wmn8.png",
    inStock: true,
    color: "Black",
    size: "S , M , L",
  },
  {
    name: "Men Casual Woolen Shirt",
    description: "BELLSTONE Men Casual Woolen Shirt",
    category: "Men Shirt",
    subCategory: "Shirt",
    originalPrice: 2527,
    discount: 70,
    price: 758,
    imageUrl: "https://i.ibb.co/RZy6Tp5/mn10.png",
    inStock: true,
    color: "Green",
    size: "L, XL",
  },
  {
    name: "Kids Dungaree",
    description:
      "Dungaree For Baby Boys & Baby Girls Casual Checkered Cotton Blend",
    category: "Kids",
    subCategory: "Dungaree",
    originalPrice: 1299,
    discount: 20,
    price: 1039,
    imageUrl: "https://i.ibb.co/RGnn9RH9/kid22.png",
    inStock: true,
    color: "Black",
    size: "3 - 6 Years , 6 - 9 Years",
  },
  {
    name: "Women Kurta Pant with Dupatta",
    description: "Women Georgette Kurta Pant Dupatta Set",
    category: "Women Ethnic",
    subCategory: "Kurta",
    originalPrice: 758,
    discount: 70,
    price: 227,
    imageUrl: "https://i.ibb.co/gFvCcYRV/wmn10.png",
    inStock: true,
    color: "Maroon",
    size: "S , M",
  },
  {
    name: "Kids Formal Shirt",
    description: "Boys Regular Fit Cotton Collar Spread Shirt",
    category: "Kids",
    subCategory: "Shirt",
    originalPrice: 799,
    discount: 20,
    price: 639,
    imageUrl: "https://i.ibb.co/mrtsMVJ5/kid34.png",
    inStock: true,
    color: "Aqua",
    size: "3 - 6 Years , 6 - 9 Years , 9 - 12 Years",
  },
  {
    name: "Men Printed Track Suit",
    description: "TRIPR Men Printed Track Suit",
    category: "Men Bottomwear",
    subCategory: "Track Suits",
    originalPrice: 1955,
    discount: 80,
    price: 391,
    imageUrl: "https://i.ibb.co/KxvTxTx3/mn21.png",
    inStock: true,
    color: "Black",
    size: "S, M",
  },
  {
    name: "Women Floral Print Maxi Dress",
    description: "Women Floral Print Cotton Rayon Stitched Long Maxi Dress",
    category: "Women Western",
    subCategory: "Maxi Dresses",
    originalPrice: 759,
    discount: 80,
    price: 152,
    imageUrl: "https://i.ibb.co/bRg5YWjs/wmn3.png",
    inStock: true,
    color: "Green",
    size: "S , M , L",
  },
  {
    name: "Kids Lehenga",
    description:
      "Indi Girls Lehenga Choli Embroidered Lehenga, Choli and Dupatta Set",
    category: "Kids",
    subCategory: "Lehenga",
    originalPrice: 299,
    discount: 0,
    price: 299,
    imageUrl: "https://i.ibb.co/4wJy9hKd/kid40.png",
    inStock: true,
    color: "Red",
    size: "6 - 9 Years , 9 - 12 Years",
  },
  {
    name: "Men Oversized Western T-shirt",
    description: "TRIPR Men Oversized Western T-shirt",
    category: "Men Shirt",
    subCategory: "T-Shirt",
    originalPrice: 815,
    discount: 59,
    price: 334,
    imageUrl: "https://i.ibb.co/5XRPjCqj/mn9.png",
    inStock: true,
    color: "Green",
    size: "S, XL",
  },
  {
    name: "Women Red Printed Sweater",
    description: "Women Solid Round Neck Red Printed Sweater",
    category: "Women Western",
    subCategory: "Sweaters",
    originalPrice: 1084,
    discount: 65,
    price: 379,
    imageUrl: "https://i.ibb.co/gLGm6gMh/wmn4.png",
    inStock: false,
    color: "Red",
    size: "XS , S , L",
  },
  {
    name: "Men Slim Fit Collar Shirt Cotton",
    description: "DENIM Men Slim Fit Collar Shirt Cotton",
    category: "Men Shirt",
    subCategory: "Shirt",
    originalPrice: 513,
    discount: 15,
    price: 436,
    imageUrl: "https://i.ibb.co/xSbPftHT/mn8.png",
    inStock: true,
    color: "Blue",
    size: "L, XL",
  },
  {
    name: "Kids Sweatshirt Set",
    description: "Stylish Boy & Girl Sweatshirt (Multicolor, Pack of 2)",
    category: "Kids",
    subCategory: "Sweatshirt",
    originalPrice: 999,
    discount: 20,
    price: 799,
    imageUrl: "https://i.ibb.co/Nn6CLWfx/kid36.png",
    inStock: true,
    color: ["Grey", "Red"],
    size: "3 - 6 Years , 6 - 9 Years , 9 - 12 Years",
  },
  {
    name: "Women Kurta Pant Dupatta Set",
    description: "Women Pure Cotton Kurta Salwar Dupatta Set",
    category: "Women Ethnic",
    subCategory: "Kurta",
    originalPrice: 647,
    discount: 65,
    price: 227,
    imageUrl: "https://i.ibb.co/PGtn8hBF/wmn13.png",
    inStock: true,
    color: "White",
    size: "S , M , L , XL",
  },
  {
    name: "Men Casual Shirt",
    description: "WOXEN Men Casual Shirt",
    category: "Men Shirt",
    subCategory: "Shirt",
    originalPrice: 971,
    discount: 45,
    price: 534,
    imageUrl: "https://i.ibb.co/1Y1k75yP/mn7.png",
    inStock: true,
    color: "Blue",
    size: "S, M, L",
  },
  {
    name: "Kids T-Shirt Set",
    description: "Boys Cotton T-Shirt & Pant Set",
    category: "Kids",
    subCategory: "Dress",
    originalPrice: 899,
    discount: 15,
    price: 764,
    imageUrl: "https://i.ibb.co/sJzVN83p/kid32.png",
    inStock: false,
    color: "Black",
    size: "3 - 6 Years , 9 - 12 Years",
  },
  {
    name: "Women Classy Tracksuit",
    description: "Colorblock Women Tracksuit Suit",
    category: "Women Sportswear",
    subCategory: "Tracksuits",
    originalPrice: 1676,
    discount: 57,
    price: 720,
    imageUrl: "https://i.ibb.co/HT5zwdGG/wmn6.png",
    inStock: true,
    color: "Black",
    size: "XS , S , M , L , XL",
  },
  {
    name: "Men Formal Pant",
    description: "COMBRAIDED Men Formal Pant",
    category: "Men Bottomwear",
    subCategory: "Pants",
    originalPrice: 1191,
    discount: 30,
    price: 834,
    imageUrl: "https://i.ibb.co/qYvtYRtj/mn4.png",
    inStock: true,
    color: "Beige",
    size: "M, L",
  },
  {
    name: "Kids Dungaree",
    description:
      "Dungaree For Baby Boys & Baby Girls Casual Checkered Cotton Blend",
    category: "Kids",
    subCategory: "Dungaree",
    originalPrice: 1299,
    discount: 20,
    price: 1039,
    imageUrl: "https://i.ibb.co/RGnn9RH9/kid22.png",
    inStock: true,
    color: "Black",
    size: "3 - 6 Years , 6 - 9 Years",
  },
  {
    name: "Women Kurta Pant with Dupatta",
    description: "Women Viscose Rayon Kurta Pant Dupatta Set",
    category: "Women Ethnic",
    subCategory: "Kurta",
    originalPrice: 569,
    discount: 70,
    price: 171,
    imageUrl: "https://i.ibb.co/GY3mfhX/wmn12.png",
    inStock: true,
    color: "Pink",
    size: "S , M , L",
  },
  {
    name: "Men Casual Woolen Shirt",
    description: "BELLSTONE Men Casual Woolen Shirt",
    category: "Men Shirt",
    subCategory: "Shirt",
    originalPrice: 2527,
    discount: 70,
    price: 758,
    imageUrl: "https://i.ibb.co/RZy6Tp5/mn10.png",
    inStock: true,
    color: "Green",
    size: "L, XL",
  },
  {
    name: "Kids Casual Shirt",
    description: "Boys Regular Fit Printed Spread Collar Casual Shirt",
    category: "Kids",
    subCategory: "Shirt",
    originalPrice: 1499,
    discount: 25,
    price: 1124,
    imageUrl: "https://i.ibb.co/cSGcLRw6/kid9.png",
    inStock: true,
    color: "Yellow",
    size: "3 - 6 Years , 6 - 9 Years , 9 - 12 Years",
  },
  {
    name: "Women Wide Leg Jeans",
    description: "Women Loose Fit High Rise Wide Leg Stretchable Jeans",
    category: "Women Western",
    subCategory: "Jeans",
    originalPrice: 1436,
    discount: 60,
    price: 574,
    imageUrl: "https://i.ibb.co/ds76qx1K/wmn8.png",
    inStock: true,
    color: "Black",
    size: "S , M , L",
  },
  {
    name: "Men Casual Oversized Shirt",
    description: "DEEMOON Men Casual Oversized Shirt",
    category: "Men Shirt",
    subCategory: "Shirt",
    originalPrice: 914,
    discount: 50,
    price: 457,
    imageUrl: "https://i.ibb.co/jkvcMNYb/mn11.png",
    inStock: true,
    color: "White",
    size: "M, L",
  },
  {
    name: "Kids Formal Shirt",
    description: "Boys Regular Fit Cotton Collar Spread Shirt",
    category: "Kids",
    subCategory: "Shirt",
    originalPrice: 799,
    discount: 20,
    price: 639,
    imageUrl: "https://i.ibb.co/mrtsMVJ5/kid34.png",
    inStock: true,
    color: "Aqua",
    size: "3 - 6 Years , 6 - 9 Years , 9 - 12 Years",
  },
  {
    name: "Women Kurta Pant with Dupatta",
    description: "Women Georgette Kurta Pant Dupatta Set",
    category: "Women Ethnic",
    subCategory: "Kurta",
    originalPrice: 758,
    discount: 70,
    price: 227,
    imageUrl: "https://i.ibb.co/gFvCcYRV/wmn10.png",
    inStock: true,
    color: "Maroon",
    size: "S , M",
  },
  {
    name: "Men Printed Track Suit",
    description: "TRIPR Men Printed Track Suit",
    category: "Men Bottomwear",
    subCategory: "Track Suits",
    originalPrice: 1955,
    discount: 80,
    price: 391,
    imageUrl: "https://i.ibb.co/KxvTxTx3/mn21.png",
    inStock: true,
    color: "Black",
    size: "S, M",
  },
  {
    name: "Kids Lehenga",
    description:
      "Indi Girls Lehenga Choli Embroidered Lehenga, Choli and Dupatta Set",
    category: "Kids",
    subCategory: "Lehenga",
    originalPrice: 299,
    discount: 0,
    price: 299,
    imageUrl: "https://i.ibb.co/4wJy9hKd/kid40.png",
    inStock: true,
    color: "Red",
    size: "6 - 9 Years , 9 - 12 Years",
  },
];
const getRandomProducts = (arr, count = 3) => {
  const copy = [...arr];
  const result = [];

  while (result.length < count && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }

  return result;
};
const Wishlist = () => {
  const navigate = useNavigate();
  const { addToCart, toastMessage, clearToast, showToast } = useCartWishlist();
  const [inspiredProducts, setInspiredProducts] = useState([]);
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      setInspiredProducts(getRandomProducts(allProducts, 4));
    }
  }, []);

  const {
    wishlist,
    toggleWishlist,
    addToCart: addToCartFromContext,
    isLoading: authLoading,
  } = useContext(AuthContext);
  const [searchInput, setSearchInput] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmpty, setShowEmpty] = useState(false);

  // Remove a product from wishlist
  const removeItem = async (id) => {
    try {
      await toggleWishlist(id, true);
      showToast("❤️ Removed from wishlist");
      window.dispatchEvent(new Event("wishlistUpdated")); // Notify other components
    } catch (err) {
      showToast("❌ Error removing from wishlist");
      console.error("Wishlist error:", err);
    }
  };

  // Move product to cart (keeps in wishlist)
  const moveToCart = async (item) => {
    try {
      await addToCartFromContext(item._id);
      showToast("✅ Added to cart");
      window.dispatchEvent(new Event("cartUpdated")); // Notify other components
    } catch (err) {
      showToast("❌ Error adding to cart");
      console.error("Cart error:", err);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // If wishlist is empty, show empty immediately
        if (wishlist.length === 0) {
          setShowEmpty(true);
          setLoading(false);
          return;
        }

        // Wishlist has items - fetch products
        const productsRes = await axios.get(
          "https://e-commerce-website-backend-d84m.onrender.com/api/products",
        );
        setProducts(productsRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [wishlist]);

  const wishlistProducts = products.filter((p) =>
    wishlist.includes(p._id.toString()),
  );

  // Show empty message if no products match wishlist
  useEffect(() => {
    if (wishlistProducts.length === 0 && wishlist.length > 0) {
      setShowEmpty(true);
    } else if (wishlistProducts.length > 0) {
      setShowEmpty(false);
    }
  }, [wishlistProducts, wishlist]);

  if (loading) return <Loading />;

  return (
    <>
      <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />

      <div className="wishlist-container">
        <div className="wishlist-header">
          ❤️ My Wishlist ({wishlistProducts.length} items)
        </div>

        <div className="wishlist-page">
          <div className="wishlist-left">
            {wishlistProducts.map((item) => (
              <div className="wishlist-item" key={item._id}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="item-image"
                />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="desc">{item.description}</p>
                  <div className="price">
                    {item.mrp && <span className="mrp">₹{item.mrp}</span>}
                    <span className="final">₹{item.price}</span>
                    {item.mrp && (
                      <span className="discount">
                        {Math.round((1 - item.price / item.mrp) * 100)}% off
                      </span>
                    )}
                  </div>
                  <div className="wishlist-actions">
                    <button
                      className="move-btn"
                      onClick={() => moveToCart(item)}
                    >
                      Move to Cart
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {showEmpty && wishlistProducts.length === 0 && (
              <>
                <div className="empty-wishlist">
                  <div className="empty-wishlist-card">
                    <div className="wishlist-emoji">💖</div>

                    <h2 className="wishlist-title">Your wishlist is empty</h2>

                    <p className="wishlist-subtitle">
                      Save items you love. Build your personal collection. Come
                      back when inspiration hits.
                    </p>

                    <div className="wishlist-actions-empty">
                      <button
                        className="wishlist-primary-btn"
                        onClick={() => navigate("/Dashboard")}
                      >
                        Discover Products
                      </button>

                      <button
                        className="wishlist-secondary-btn"
                        onClick={() => navigate("/Redirect")}
                      >
                        Explore Categories
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="wishlist-right">
            <h2
              style={{
                marginBottom: 40,
                color: "#ff4da6",
                fontWeight: "bold",
                fontFamily: "satisfy, cursive",
              }}
            >
              Trending Picks
            </h2>

            <div className="mini-stack">
              {inspiredProducts.map((item, idx) => (
                <div
                  className="mini-card"
                  onClick={() =>
                    navigate("/ProductDetails", {
                      state: { product: item, index: idx },
                    })
                  }
                >
                  <img src={item.imageUrl} alt={item.name} />
                  <div className="mini-info">
                    <p className="mini-name">{item.name}</p>
                    <p className="mini-price">₹{item.price}</p>
                  </div>
                </div>
              ))}
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
};

export default Wishlist;
