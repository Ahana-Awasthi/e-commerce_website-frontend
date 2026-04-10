import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "./Nav";

function Redirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchInput, setSearchInput] = useState("");
  const [pages, setPages] = useState([]);

  // Default all possible pages
  const allPages = [
    { name: "Men", route: "/Shop/Men" },
    { name: "Women", route: "/Shop/Women" },
    { name: "Kids", route: "/Shop/Kids" },
    { name: "Beauty", route: "/Shop/Beauty" },
    { name: "Home", route: "/Shop/Home" },
    { name: "Electronics", route: "/Shop/Electronics" },
  ];

  // Load pages from localStorage on mount
  useEffect(() => {
    const storedPages =
      JSON.parse(localStorage.getItem("availablePages")) || [];
    // Filter allPages to only include stored names
    const filteredPages =
      storedPages.length > 0
        ? allPages.filter((p) => storedPages.includes(p.name))
        : allPages; // fallback to all if nothing stored
    setPages(filteredPages);
  }, []);

  const handleClick = (pageName, route) => {
    // Extract current query params
    const params = new URLSearchParams(location.search);
    const currentSearchQuery = params.get("searchQuery") || "";

    const combinedQuery = `${pageName.toLowerCase()} ${currentSearchQuery}`;
    const fullQueryEncoded = encodeURIComponent(combinedQuery);
    const searchQueryEncoded = encodeURIComponent(currentSearchQuery);

    navigate(
      `${route}?fullQuery=${fullQueryEncoded}&searchQuery=${searchQueryEncoded}`,
    );
  };

  return (
    <>
      <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />
      <div style={{ textAlign: "center", marginTop: 100, marginBottom: 100 }}>
        <h2>Which category do you want to explore?</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "50px",
            marginTop: "20px",
          }}
        >
          {pages.map((page) => (
            <div
              key={page.route}
              onClick={() => handleClick(page.name, page.route)}
              style={{
                cursor: "pointer",
                width: "150px",
                height: "100px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                fontSize: "18px",
                fontWeight: "bold",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 10px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
              }}
            >
              {page.name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Redirect;
