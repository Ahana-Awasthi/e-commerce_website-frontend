import { useState, useEffect } from "react";
import "./FilterBar.css";

function FilterBar({ menProducts, setFilteredProducts, category = "Men", products }) {
  // Use products if provided, otherwise fall back to menProducts for backward compatibility
  const allProducts = products || menProducts;

  // Dynamic subCategories based on category
  const getSubCategories = () => {
    const subCatMap = {
      "Men": ["T-Shirts", "Shirts", "Jeans", "Shorts", "Pants"],
      "Women": ["T-Shirts", "Shirts", "Jeans", "Shorts", "Pants", "Dresses"],
      "Kids": ["T-Shirts", "Shirts", "Shorts", "Pants"]
    };
    return subCatMap[category] || ["T-Shirts", "Shirts", "Jeans", "Shorts", "Pants"];
  };

  const subCategoryOptions = getSubCategories();
  const initialSubCategory = subCategoryOptions.reduce((acc, cat) => {
    acc[cat] = false;
    return acc;
  }, {});

  // Pending filter states (user selections before clicking Apply)
  const [pendingSubCategory, setPendingSubCategory] = useState(initialSubCategory);
  const [pendingPrice, setPendingPrice] = useState(5000);
  const [pendingSize, setPendingSize] = useState(null);
  const [pendingColor, setPendingColor] = useState(null);
  const [pendingDiscount, setPendingDiscount] = useState(0);
  const [pendingAvailability, setPendingAvailability] = useState(false);

  // Applied filters (used to filter products)
  const [appliedFilters, setAppliedFilters] = useState({
    subCategory: initialSubCategory,
    price: pendingPrice,
    size: pendingSize,
    color: pendingColor,
    discount: pendingDiscount,
    availability: pendingAvailability,
  });

  // Whenever appliedFilters or allProducts changes, filter the products
  useEffect(() => {
    const filtered = allProducts.filter((product) => {
      // SubCategory filter - only apply if product has subCategory field
      const subCategorySelected = Object.values(appliedFilters.subCategory).some(Boolean);
      let subCategoryMatch = true;
      
      if (subCategorySelected && product.subCategory) {
        subCategoryMatch = Object.keys(appliedFilters.subCategory).some(
          (subCat) => {
            return appliedFilters.subCategory[subCat] && product.subCategory && product.subCategory.trim() === subCat.trim();
          }
        );
      } else if (subCategorySelected && !product.subCategory) {
        // If filter is selected but product doesn't have subCategory field, don't show it
        subCategoryMatch = false;
      }

      // Price filter
      const priceMatch = product.price <= appliedFilters.price;

      // Size filter
      const sizeMatch = appliedFilters.size 
        ? product.size && product.size.includes(appliedFilters.size) 
        : true;

      // Color filter
      const colorMatch = appliedFilters.color ? product.color && product.color.trim().toLowerCase() === appliedFilters.color.toLowerCase() : true;

      // Discount filter
      const discountMatch = product.discount >= appliedFilters.discount;

      // Availability filter (show only in-stock if checked)
      const availabilityMatch = appliedFilters.availability ? product.inStock : true;

      return subCategoryMatch && priceMatch && sizeMatch && colorMatch && discountMatch && availabilityMatch;
    });

    setFilteredProducts(filtered);
  }, [appliedFilters, allProducts]);

  // Apply button updates appliedFilters
  const applyFilters = () => {
    setAppliedFilters({
      subCategory: { ...pendingSubCategory },
      price: pendingPrice,
      size: pendingSize,
      color: pendingColor,
      discount: pendingDiscount,
      availability: pendingAvailability,
    });
  };

  // Clear button resets everything
  const clearFilters = () => {
    setPendingSubCategory(initialSubCategory);
    setPendingPrice(5000);
    setPendingSize(null);
    setPendingColor(null);
    setPendingDiscount(0);
    setPendingAvailability(false);

    setAppliedFilters({
      subCategory: initialSubCategory,
      price: 5000,
      size: null,
      color: null,
      discount: 0,
      availability: false,
    });
  };

  return (
    <div className="filter-bar">
      {/* SubCategory */}
      <div className="filter-section">
        <h4>Category</h4>
        {subCategoryOptions.map((subCat) => (
          <label key={subCat}>
            <input
              type="checkbox"
              checked={pendingSubCategory[subCat]}
              onChange={(e) => setPendingSubCategory({ ...pendingSubCategory, [subCat]: e.target.checked })}
            />{" "}
            {subCat}
          </label>
        ))}
      </div>

      {/* Price */}
      <div className="filter-section">
        <h4>Price</h4>
        <div className="range-container">
          <span className="range-badge">₹{pendingPrice}</span>
          <input
            type="range"
            min="100"
            max="5000"
            value={pendingPrice}
            onChange={(e) => setPendingPrice(Number(e.target.value))}
          />
        </div>
        <div className="range-values">
          <span>100</span>
          <span>5000</span>
        </div>
      </div>

      {/* Size */}
      <div className="filter-section">
        <h4>Size</h4>
        <div className="size-options">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <button
              key={size}
              onClick={() => setPendingSize(size)}
              className={pendingSize === size ? "selected-size" : ""}>
            {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="filter-section">
        <h4>Color</h4>
        <div className="color-options">
          {["White", "Black", "Green", "Blue", "Red", "Yellow", "Purple", "Brown"].map((color) => {
            const colorMap = {
              "White": "#fff",
              "Black": "#000",
              "Green": "#00c776",
              "Blue": "#00a6ff",
              "Red": "#ff3434",
              "Yellow": "#fbc531",
              "Purple": "#8e44ad",
              "Brown": "#a67c52"
            };
            return (
              <span
                key={color}
                className={`color-circle ${pendingColor === color ? "selected-color" : ""}`}
                style={{ backgroundColor: colorMap[color] }}
                title={color}
                onClick={() => setPendingColor(color)}
              ></span>
            );
          })}
        </div>
      </div>

      {/* Discount */}
      <div className="filter-section">
        <h4>Discount</h4>
        <div className="range-container">
          <span className="range-badge">{pendingDiscount}%</span>
          <input
            type="range"
            min="0"
            max="90"
            value={pendingDiscount}
            onChange={(e) => setPendingDiscount(Number(e.target.value))}
          />
        </div>
        <div className="range-values">
          <span>0%</span>
          <span>90%</span>
        </div>
      </div>

      {/* Availability */}
      <div className="filter-section">
        <h4>Availability</h4>
        <label>
          <input
            type="checkbox"
            checked={pendingAvailability}
            onChange={(e) => setPendingAvailability(e.target.checked)}
          />{" "}
          In Stock Only
        </label>
      </div>

      {/* Buttons */}
      <div className="filter-buttons">
        <button className="apply-btn px-4" onClick={applyFilters}>
          Apply Filter
        </button>
        <button className="cancel-btn px-4" onClick={clearFilters}>
          Clear All
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
