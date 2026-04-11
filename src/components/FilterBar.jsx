// src/components/FilterBar.jsx
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import "./FilterBar.css";

const MenColors = [
  "White",
  "Black",
  "Green",
  "Blue",
  "Red",
  "Yellow",
  "Purple",
  "Brown",
  "Grey",
  "Beige",
  "Maroon",
];
const WomenColors = [
  "White",
  "Black",
  "Green",
  "Blue",
  "Red",
  "Yellow",
  "Purple",
  "Brown",
  "Pink",
  "Beige",
  "Cyan",
  "Orange",
];
const KidsColors = [
  "Blue",
  "Yellow",
  "Green",
  "Purple",
  "Red",
  "Pink",
  "Black",
  "Beige",
  "White",
  "Brown",
  "Grey",
  "Sky Blue",
];
const HomeColors = ["White", "Beige", "Brown", "Gray"];
const ElectronicsColors = ["Black", "Silver", "Gray"];
const BeautyColors = [];

function FilterBar({
  products,
  setFilteredProducts,
  searchArray = [],
  setNoProductsReason,
}) {
  // At the top of your FilterBar.jsx (inside or outside the component)
  const ChevronDownIcon = ({ open }) => (
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
      className={`chevron-icon ${open ? "open" : ""}`}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 9l6 6l6 -6" />
    </svg>
  );
  const [openSection, setOpenSection] = useState(null);
  const location = useLocation();
  const allProducts = products || [];
  // Determine which sections actually have product data

  // Determine category from pathname
  const category = useMemo(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes("/men")) return "Men";
    if (path.includes("/women")) return "Women";
    if (path.includes("/kids")) return "Kids";
    if (path.includes("/home")) return "Home";
    if (path.includes("/electronics")) return "Electronics";
    if (path.includes("/beauty")) return "Beauty";
    return "General";
  }, [location.pathname]);

  const getSubCategories = () => {
    const map = {
      Men: [
        "T-Shirt",
        "Shirt",
        "Jeans",
        "Shorts",
        "Pants",
        "Jackets",
        "Track Suits",
        "Accessories",
        "Ethnic",
        "Kurta Pyjama",
        "Kurta",
        "Men Combo",
      ],
      Women: [
        "Kurta Pyjama",
        "Dungaree",
        "T-Shirt",
        "Shirt",
        "Nightwear",
        "Sweatshirt",
        "Maxi",
        "Dress",
        "Shorts",
        "Set",
        "Jumpsuit",
        "Lehenga",
        "Frock",
        "Pant",
        "Kurta",
      ],
      Kids: [
        "Kurta Pyjama",
        "Kurta",
        "Dungaree",
        "T-Shirt",
        "Shirt",
        "Nightwear",
        "Sweatshirt",
        "Maxi",
        "Dress",
        "Shorts",
        "Set",
        "Jumpsuit",
        "Lehenga",
        "Frock",
        "Pant",
      ],
      Beauty: [
        "Makeup",
        "Face Cream",
        "Serum",
        "Handbag",
        "Body Care",
        "Haircare",
        "Concealer",
        "Mascara",
        "Lip Crayon",
        "Lip Gloss",
        "Eyeliner",
        "Bags & Cases",
        "Storage & Organizers",
        "Skincare",
        "Lip Care",
      ],
      Home: ["Furniture", "Decor", "Appliance"],
      Electronics: [
        "Mobile",
        "Laptop",
        "Monitor",
        "Keyboard",
        "Mouse",
        "Console",
        "VR",
        "Camera",
        "Headphone",
        "Speaker",
        "Power Bank",
        "Earbuds",
        "Watch",
        "Smart TV",
        "Controller",
        "Drone",
        "Oven",
        "AC",
        "Appliances",
        "Accessories",
      ],
      General: [],
    };
    return map[category] || [];
  };

  const getSizes = () => {
    if (category === "Men" || category === "Women")
      return ["S", "M", "L", "XL", "XXL"];
    if (category === "Kids")
      return ["3 - 6 Years", "6 - 9 Years", "9 - 12 Years"];
    if (category === "Beauty") return [];
    if (category === "Home" || category === "Electronics")
      return ["Standard", "Compact", "Large"];
    return [];
  };

  const getColors = () => {
    if (category === "Men") return MenColors;
    if (category === "Women") return WomenColors;
    if (category === "Kids") return KidsColors;
    if (category === "Home") return HomeColors;
    if (category === "Electronics") return ElectronicsColors;
    if (category === "Beauty") return BeautyColors;
    return [];
  };

  const subCategoryOptions = useMemo(() => getSubCategories(), [category]);
  const sizeOptions = useMemo(() => getSizes(), [category]);
  const colorOptions = useMemo(() => getColors(), [category]);
  const hasSize = allProducts.some((p) => p.size && p.size.length > 0);
  const hasColor = allProducts.some((p) => p.color && p.color.length > 0);
  const hasSubCategory = subCategoryOptions.length > 0; // keep your existing logic
  const initialSubCategory = useMemo(
    () =>
      subCategoryOptions.reduce((acc, cat) => ({ ...acc, [cat]: false }), {}),
    [subCategoryOptions],
  );

  // STATES
  const [pendingSubCategory, setPendingSubCategory] =
    useState(initialSubCategory);
  const [pendingPrice, setPendingPrice] = useState(5000);
  const [pendingSize, setPendingSize] = useState(null);
  const [pendingColor, setPendingColor] = useState([]);
  const [pendingDiscount, setPendingDiscount] = useState(0);
  const [pendingAvailability, setPendingAvailability] = useState(false);
  useEffect(() => {
    setPendingSubCategory(initialSubCategory);
    setAppliedFilters((prev) => ({
      ...prev,
      subCategory: initialSubCategory,
    }));
  }, [initialSubCategory]);
  // To store applied filters only on "Apply Filter"
  const [appliedFilters, setAppliedFilters] = useState({
    subCategory: initialSubCategory,
    price: 5000,
    size: null,
    color: [],
    discount: 0,
    availability: false,
  });

  const normalize = (str) => str?.toString().trim().toLowerCase() || "";

  // PARSE search array for sizes, colors, price range
  const parseSearchArray = () => {
    let priceLow = null,
      priceHigh = null,
      sizes = [],
      colors = [];

    // ✅ ENHANCED Size Map - covers ALL possibilities
    const sizeMap = {
      // Standard sizes
      s: "S",
      m: "M",
      l: "L",
      xl: "XL",
      xxl: "XXL",
      xs: "XS",
      // Full words
      small: "S",
      medium: "M",
      large: "L",
      extra: "XL",
      "extra small": "XS",
      "extra large": "XL",
      "extra extra large": "XXL",
      // Kids sizes
      3: "3 - 6 Years",
      4: "3 - 6 Years",
      5: "3 - 6 Years",
      6: "6 - 9 Years",
      7: "6 - 9 Years",
      8: "6 - 9 Years",
      9: "9 - 12 Years",
      // Common variations
      sm: "S",
      md: "M",
      lg: "L",
      xxlarge: "XXL",
    };

    for (let i = 0; i < searchArray.length; i++) {
      const w = normalize(searchArray[i]);

      // Price parsing (unchanged)
      if (w === "between" && i + 3 < searchArray.length) {
        const next1 = normalize(searchArray[i + 1]);
        const next2 = normalize(searchArray[i + 2]);
        const next3 = normalize(searchArray[i + 3]);
        if (next2 === "and" && /^\d+$/.test(next1) && /^\d+$/.test(next3)) {
          priceLow = Math.min(parseInt(next1), parseInt(next3));
          priceHigh = Math.max(parseInt(next1), parseInt(next3));
          i += 3;
          continue;
        }
      }
      if (
        w === "under" &&
        i + 1 < searchArray.length &&
        /^\d+$/.test(normalize(searchArray[i + 1]))
      ) {
        priceHigh = parseInt(searchArray[i + 1]);
        i++;
        continue;
      }
      if (
        w === "above" &&
        i + 1 < searchArray.length &&
        /^\d+$/.test(normalize(searchArray[i + 1]))
      ) {
        priceLow = parseInt(searchArray[i + 1]);
        i++;
        continue;
      }

      // ✅ SUPER ENHANCED SIZE MATCHING
      if (sizeMap[w]) {
        sizes.push(sizeMap[w]);
        continue;
      }

      // ✅ SUPER ENHANCED COLOR MATCHING - partial + fuzzy
      const colorMatch = colorOptions.find((c) => {
        const colorNorm = normalize(c);
        return (
          colorNorm === w ||
          colorNorm.includes(w) ||
          w.includes(colorNorm) ||
          colorNorm.replace(/\s+/g, "") === w.replace(/\s+/g, "")
        );
      });
      if (colorMatch) {
        colors.push(colorMatch);
        continue;
      }
    }

    return {
      priceLow,
      priceHigh,
      sizes: [...new Set(sizes)],
      colors: [...new Set(colors)],
    };
  };

  // EFFECT: Apply search array filters automatically
  useEffect(() => {
    // RESET TO ALL PRODUCTS if search is empty AND no filters applied
    const noFiltersApplied =
      searchArray.length === 0 &&
      !Object.values(appliedFilters.subCategory).some(Boolean) &&
      appliedFilters.price === 5000 &&
      !appliedFilters.size &&
      appliedFilters.color.length === 0 &&
      appliedFilters.discount === 0 &&
      !appliedFilters.availability;

    if (noFiltersApplied) {
      setFilteredProducts(allProducts);
      setNoProductsReason("");
      return;
    }
    if (!allProducts || allProducts.length === 0) {
      setFilteredProducts([]);
      setNoProductsReason("search");
      return;
    }

    // ✅ FIXED: hasSearch alone triggers filtering!
    const hasActiveSearchOrFilters =
      searchArray.length > 0 ||
      Object.values(appliedFilters.subCategory).some(Boolean) ||
      appliedFilters.price !== 5000 ||
      appliedFilters.size ||
      appliedFilters.color.length > 0 ||
      appliedFilters.discount > 0 ||
      appliedFilters.availability;

    const {
      priceLow,
      priceHigh,
      sizes: searchSizes,
      colors: searchColors,
    } = parseSearchArray();

    const filtered = allProducts.filter((product) => {
      // 1. SUBCATEGORY FILTER
      const subMatch =
        !Object.values(appliedFilters.subCategory).some(Boolean) ||
        Object.keys(appliedFilters.subCategory).some(
          (sub) =>
            appliedFilters.subCategory[sub] &&
            normalize(product.subCategory) === normalize(sub),
        );

      // 2. SEARCH MATCH - SIMPLIFIED & BULLETPROOF
      const searchMatch =
        searchArray.length === 0 ||
        (() => {
          const productWords = searchArray.filter((word) => {
            const w = normalize(word);
            return (
              !["under", "above", "between", "and"].includes(w) &&
              !/^\d+$/.test(w) &&
              !colorOptions.some((c) => normalize(c) === w)
            );
          });

          if (productWords.length === 0) return true;

          const productText = `${normalize(product.name)} ${normalize(product.subCategory)}`;

          return productWords.some((word) => {
            const w = normalize(word);

            const variations = [w, w.endsWith("s") ? w.slice(0, -1) : w + "s"];

            return variations.some((v) => productText.includes(v));
          });
        })();

      // 3. COLOR MATCH
      const allColors = [...appliedFilters.color, ...searchColors];
      const colorMatch =
        allColors.length === 0 ||
        (product.color &&
          (Array.isArray(product.color)
            ? product.color.some((c) =>
                allColors.some((fc) => normalize(fc) === normalize(c)),
              )
            : allColors.some(
                (fc) => normalize(fc) === normalize(product.color),
              )));

      // 4. SIZE MATCH
      let sizeMatch = true;
      const allSizes = appliedFilters.size
        ? [appliedFilters.size]
        : searchSizes;

      if (allSizes.length > 0) {
        // Normalize product sizes: handle array or comma-separated string
        let productSizes = [];
        if (Array.isArray(product.size)) {
          productSizes = product.size.map((s) => s.trim());
        } else if (typeof product.size === "string") {
          productSizes = product.size.split(",").map((s) => s.trim());
        }

        sizeMatch = allSizes.some((ts) => productSizes.includes(ts));
      }

      // 5. PRICE MATCH
      const priceVal = Number(product.price);
      let priceMatch = priceVal <= appliedFilters.price;
      if (priceLow !== null) priceMatch = priceMatch && priceVal >= priceLow;
      if (priceHigh !== null) priceMatch = priceMatch && priceVal <= priceHigh;

      // 6. OTHER FILTERS
      const discountMatch = product.discount >= appliedFilters.discount;
      const availabilityMatch = appliedFilters.availability
        ? product.inStock === true
        : true;

      return (
        subMatch &&
        searchMatch &&
        colorMatch &&
        sizeMatch &&
        priceMatch &&
        discountMatch &&
        availabilityMatch
      );
    });

    setFilteredProducts(filtered);
    setNoProductsReason(filtered.length === 0 ? "search" : "");
  }, [
    allProducts,
    appliedFilters,
    searchArray,
    colorOptions,
    sizeOptions,
    setFilteredProducts,
    setNoProductsReason,
  ]);
  // CLEAR PENDING filters
  const clearFilters = () => {
    setOpenSection(null); // ← fixes weird glitches
    const cleared = {
      subCategory: initialSubCategory,
      price: 5000,
      size: null,
      color: [],
      discount: 0,
      availability: false,
    };

    setPendingSubCategory(initialSubCategory);
    setPendingPrice(5000);
    setPendingSize(null);
    setPendingColor([]);
    setPendingDiscount(0);
    setPendingAvailability(false);
    
    setAppliedFilters(cleared);
    setIsFilterActive(false); // 🔥 THIS IS MISSING IN MOST CASES
  };
  // APPLY pending filters
  const handleApplyFilter = () => {
    setAppliedFilters({
      subCategory: pendingSubCategory,
      price: pendingPrice,
      size: pendingSize,
      color: pendingColor,
      discount: pendingDiscount,
      availability: pendingAvailability,
    });
    setIsFilterActive(true); // 🔥 THIS IS MISSING IN MOST CASES
  };
  // Ensure all products are shown initially, before any filters/search

  return (
    <>
      <div className="page-container">
        <div className="sidebar-wrapper">
          <div
            className="filter-bar"
            style={{
              maxHeight: openSection === "category" ? "1000px" : "600px",
              minHeight: openSection === "category" ? "210%" : "150%",
            }}
          >
            {/* Category Section */}
            {subCategoryOptions.length > 0 && (
              <div className="filter-section">
                <h4
                  className="accordion-header"
                  onClick={() =>
                    setOpenSection(
                      openSection === "category" ? null : "category",
                    )
                  }
                >
                  Category{" "}
                  <span
                    className={`chevron ${openSection === "category" ? "open" : ""}`}
                  >
                    <ChevronDownIcon open={openSection === "category"} />
                  </span>
                </h4>
                {openSection === "category" && (
                  <div className="accordion-body">
                    {subCategoryOptions.map((subCat) => (
                      <label
                        key={subCat}
                        style={{ fontSize: "18px", paddingLeft: 50 }}
                      >
                        <input
                          type="checkbox"
                          checked={pendingSubCategory[subCat]}
                          onChange={(e) =>
                            setPendingSubCategory({
                              ...pendingSubCategory,
                              [subCat]: e.target.checked,
                            })
                          }
                        />{" "}
                        {subCat}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Price Section */}
            <div className="filter-section">
              <h4
                className="accordion-header"
                onClick={() =>
                  setOpenSection(openSection === "price" ? null : "price")
                }
              >
                Price{" "}
                <span
                  className={`chevron ${openSection === "price" ? "open" : ""}`}
                >
                  <ChevronDownIcon open={openSection === "price"} />
                </span>
              </h4>
              {openSection === "price" && (
                <div className="accordion-body" style={{ padding: 30 }}>
                  <div className="range-container" style={{ marginTop: 50 }}>
                    <span className="range-badge" style={{ fontSize: "14px" }}>
                      ₹{pendingPrice}
                    </span>
                    <input
                      style={{ fontSize: "18px" }}
                      type="range"
                      min="100"
                      max="5000"
                      value={pendingPrice}
                      onChange={(e) => setPendingPrice(Number(e.target.value))}
                    />
                  </div>
                  <div className="range-values" style={{ fontSize: "17px" }}>
                    <span>100</span>
                    <span>5000</span>
                  </div>
                </div>
              )}
            </div>

            {/* Size Section */}
            {hasSize && sizeOptions.length > 0 && (
              <div className="filter-section">
                <h4
                  className="accordion-header"
                  onClick={() =>
                    setOpenSection(openSection === "size" ? null : "size")
                  }
                >
                  Size{" "}
                  <span
                    className={`chevron ${openSection === "size" ? "open" : ""}`}
                  >
                    <ChevronDownIcon open={openSection === "size"} />
                  </span>
                </h4>
                {openSection === "size" && (
                  <div
                    className="accordion-body size-options"
                    style={{ padding: 8 }}
                  >
                    {sizeOptions.map((size) => (
                      <button
                        key={size}
                        className={pendingSize === size ? "selected-size" : ""}
                        onClick={() =>
                          setPendingSize(pendingSize === size ? null : size)
                        }
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Color Section */}
            {hasColor && colorOptions.length > 0 && (
              <div className="filter-section">
                <h4
                  className="accordion-header"
                  onClick={() =>
                    setOpenSection(openSection === "color" ? null : "color")
                  }
                >
                  Color{" "}
                  <span
                    className={`chevron ${openSection === "color" ? "open" : ""}`}
                  >
                    <ChevronDownIcon open={openSection === "color"} />
                  </span>
                </h4>
                {openSection === "color" && (
                  <div
                    className="accordion-body color-options"
                    style={{ marginTop: 20, padding: 20 }}
                  >
                    {colorOptions.map((color, i) => (
                      <div
                        key={i}
                        className={`color-circle ${
                          pendingColor.includes(color) ? "selected" : ""
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                        onClick={() => {
                          const newColors = pendingColor.includes(color)
                            ? pendingColor.filter((c) => c !== color)
                            : [...pendingColor, color];
                          setPendingColor(newColors);
                        }}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Discount Section */}
            <div className="filter-section">
              <h4
                className="accordion-header"
                onClick={() =>
                  setOpenSection(openSection === "discount" ? null : "discount")
                }
              >
                Discount{" "}
                <span
                  className={`chevron ${openSection === "discount" ? "open" : ""}`}
                >
                  <ChevronDownIcon open={openSection === "discount"} />
                </span>
              </h4>
              {openSection === "discount" && (
                <div className="accordion-body" style={{ padding: 30 }}>
                  <div className="range-container" style={{ marginTop: 50 }}>
                    <span className="range-badge" style={{ fontSize: "14px" }}>
                      {pendingDiscount}%
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      value={pendingDiscount}
                      onChange={(e) =>
                        setPendingDiscount(Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="range-values" style={{ fontSize: "17px" }}>
                    <span>0%</span>
                    <span>90%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Availability Section */}
            <div className="filter-section">
              <h4
                className="accordion-header"
                onClick={() =>
                  setOpenSection(
                    openSection === "availability" ? null : "availability",
                  )
                }
              >
                Availability{" "}
                <span
                  className={`chevron ${openSection === "availability" ? "open" : ""}`}
                >
                  <ChevronDownIcon open={openSection === "availability"} />
                </span>
              </h4>
              {openSection === "availability" && (
                <div className="accordion-body" style={{ padding: 30 }}>
                  <label style={{ fontSize: "18px" }}>
                    <input
                      type="checkbox"
                      checked={pendingAvailability}
                      onChange={(e) => setPendingAvailability(e.target.checked)}
                    />{" "}
                    In Stock Only
                  </label>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div
              className="filter-buttons"
              style={{
                display: "flex",
                marginTop: openSection === "category" ? "1rem" : "4rem",
              }}
            >
              <button className="apply-btn px-4" onClick={handleApplyFilter}>
                Apply Filter
              </button>
              <button className="cancel-btn px-4" onClick={clearFilters}>
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FilterBar;
