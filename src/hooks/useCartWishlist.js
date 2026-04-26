import { useState } from "react";

/**
 * Centralized hook for cart and wishlist operations
 * Used across all pages (Shop, ProductDetails, Dashboard, Category pages, etc.)
 */
export const useCartWishlist = () => {
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2000);
  };

  /**
   * Add product to cart
   * @param {string} productId - Product ID to add
   * @param {function} setCartCallback - State setter for cart (optimistic update)
   * @param {function} navigateCallback - Navigate function for redirect on auth error
   */
  const addToCart = async (productId, setCartCallback, navigateCallback) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigateCallback("/login");
      return;
    }

    try {
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
        showToast("✅ Added to cart");
        // Optimistic frontend update
        setCartCallback((prev) => {
          const productIdStr = String(productId);
          const existing = prev.find(
            (item) => String(item[0]) === productIdStr,
          );
          if (existing) {
            // increment quantity locally too
            return prev.map((item) =>
              String(item[0]) === productIdStr
                ? [item[0], String(Number(item[1]) + 1)]
                : item,
            );
          } else {
            // first time adding
            return [...prev, [productIdStr, "1"]];
          }
        });
        // Dispatch event to update navbar badges
        setTimeout(() => {
          window.dispatchEvent(new Event("cartUpdated"));
        }, 100);
        console.log("✅ Product added or quantity incremented:", productId);
      } else {
        showToast("❌ Failed to add to cart");
        console.error("Cart update failed:", data.message || data);
      }
    } catch (err) {
      showToast("❌ Error updating cart");
      console.error("Cart error:", err);
    }
  };

  /**
   * Toggle product in wishlist (add or remove)
   * @param {string} productId - Product ID to toggle
   * @param {boolean} isWishlisted - Current wishlist status
   * @param {function} setWishlistCallback - State setter for wishlist
   * @param {function} navigateCallback - Navigate function for redirect on auth error
   */
  const toggleWishlist = async (
    productId,
    isWishlisted,
    setWishlistCallback,
    navigateCallback,
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigateCallback("/login");
      return;
    }

    try {
      console.log(
        `${isWishlisted ? "Removing" : "Adding"} product ${productId} ${isWishlisted ? "from" : "to"} wishlist`,
      );

      const res = await fetch("https://e-commerce-website-backend-d84m.onrender.com/api/wishlist", {
        method: isWishlisted ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      console.log(`Wishlist response:`, data, "Status:", res.status);

      if (res.ok) {
        if (isWishlisted) {
          showToast("✅ Removed from wishlist");
          // Optimistic update: remove from wishlist
          setWishlistCallback((prev) =>
            prev.filter((wid) => String(wid) !== String(productId)),
          );
        } else {
          showToast("✅ Added to wishlist");
          // Optimistic update: add to wishlist
          setWishlistCallback((prev) => [...prev, productId]);
        }
        // Dispatch event to update navbar badges
        setTimeout(() => {
          window.dispatchEvent(new Event("wishlistUpdated"));
        }, 100);
        console.log("✅ Wishlist updated");
      } else {
        showToast("❌ Failed to update wishlist");
        console.error("Wishlist update failed:", data.message || data);
      }
    } catch (err) {
      showToast("❌ Error updating wishlist");
      console.error("Wishlist error:", err);
    }
  };

  return {
    addToCart,
    toggleWishlist,
    toastMessage,
    showToast,
    clearToast: () => setToastMessage(""),
  };
};
