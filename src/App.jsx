import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import NavBar from "./components/Nav";
import LoginPage from "./components/LoginPage";
import About from "./components/About";
import Contact from "./components/Contact";
import ControlledCarousel from "./components/Carousel";
import ProductGrid from "./components/ProductGrid";
import CategoriesNav from "./components/CategoriesNav";
import ScrollCards from "./components/ScrollCards";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";
import Chatbot from "./components/Chatbot";
import Cart from "./components/Cart";
import Wishlist from "./components/Wishlist";
import ProductDetails from "./components/ProductDetailsPage";
import Checkout from "./components/CheckoutPage";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Import pages normally instead of lazy
import MenPage from "./components/MenPage.jsx";
import WomenPage from "./components/WomenPage.jsx";
import KidsPage from "./components/KidsPage";
import BeautyPage from "./components/BeautyPage";
import ElectronicsPage from "./components/ElectronicsPage";
import Redirect from "./components/Redirect.jsx";
import HomePage from "./components/HomePage";
import Shop from "./components/Shop.jsx";
import OrderDetails from "./components/OrderDetails.jsx";

// Home component (kept separate)
function Home() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    userName: localStorage.getItem("userName"),
  });
  return (
    <>
      <ScrollToTop />
      <ControlledCarousel />
      <ProductGrid />
      <ScrollCards />
    </>
  );
}

// Main app content wrapper that uses AuthContext
function AppContent() {
  const { isLoading } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [showFilters, setShowFilters] = useState(false);
const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };
 useEffect(() => {
   const handleResize = () => {
     const mobile = window.innerWidth <= 768;
     setIsMobile(mobile);

     // auto behavior:
     if (!mobile)
       setShowFilters(true); // desktop ALWAYS show
     else setShowFilters(false); // mobile default hidden
   };

   handleResize(); // run once on load
   window.addEventListener("resize", handleResize);

   return () => window.removeEventListener("resize", handleResize);
 }, []);

  const shouldShowFilters = !isMobile || showFilters;
  return (
    <>
      <ScrollToTop />
      <NavBar />
      <div style={{ backgroundColor: "#f8f9fa" }}>
        <CategoriesNav toggleFilters={toggleFilters} showFilters={showFilters}/>
      </div>

      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" /> : <Home />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/Shop/:type"
          element={
            <Shop
              showFilters={showFilters}
              toggleFilters={toggleFilters}
              shouldShowFilters={shouldShowFilters}
            />
          }
        />{" "}
        <Route
          path="/order-details/:orderId"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        {/* Category pages */}
        <Route path="/Redirect" element={<Redirect />} />
        <Route path="/Men" element={<MenPage />} />
        <Route path="/Women" element={<WomenPage />} />
        <Route path="/Kids" element={<KidsPage />} />
        <Route path="/Beauty" element={<BeautyPage />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/Electronics" element={<ElectronicsPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/ProductDetails" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/Chatbot" element={<Chatbot />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

function App() {
  useEffect(() => {
    let storedPages = localStorage.getItem("availablePages");

    // Treat "null" or undefined or missing as empty
    if (!storedPages || storedPages === "null") {
      const defaultPages = [
        "Men",
        "Women",
        "Kids",
        "Beauty",
        "Home",
        "Electronics",
      ];
      localStorage.setItem("availablePages", JSON.stringify(defaultPages));
      console.log("Initialized availablePages in localStorage:", defaultPages);
    } else {
      console.log("availablePages already exists:", JSON.parse(storedPages));
    }
  }, []);

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
