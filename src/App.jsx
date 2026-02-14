import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/Nav";
import LoginPage from "./components/LoginPage";
import About from "./components/About";
import Contact from "./components/Contact";
import ControlledCarousel from "./components/Carousel";
import ProductGrid from "./components/ProductGrid";
import CategoriesNav from "./components/CategoriesNav";
import ScrollCards from "./components/ScrollCards";
import MenPage from "./components/MenPage"; 
import WomenPage from "./components/WomenPage"; 
import Footer from "./components/Footer";
import KidsPage from "./components/KidsPage";

function Home() {
  return (
    <>
      <ControlledCarousel />
      <ProductGrid />
      <ScrollCards />
    </>
  );
}


function App() {
  return (
    <>
      <NavBar />
      <CategoriesNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Men" element={<MenPage />} />
        <Route path="/Women" element={<WomenPage />} />
        <Route path="/Kids" element={<KidsPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
