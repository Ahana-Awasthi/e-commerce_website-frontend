import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import './Categories.css';

function CategoriesNav() {
  const [index, setIndex] = useState(0);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsCategoriesOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="categories-nav bg-dark-subtle">
      <div className="categories-top">
        <button 
          className="categories-hamburger"
          onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        <Link to="/login" className="cart-icons"> 
          <i className="fa-solid fa-heart fs-4 mx-4 text-dark"></i>
          <i className="fa-solid fa-cart-shopping fs-4 text-dark"></i>
        </Link>
      </div>
      <ul className={`nav-links categories-links ${isCategoriesOpen ? 'active' : ''}`}>
        <li><Link to="/Men" className="text-dark">Men</Link></li>
        <li><Link to="/Women" className="text-dark">Women</Link></li>
        <li><Link to="/Kids" className="text-dark">Kids</Link></li>
        <li><Link to="/Beauty" className="text-dark">Beauty</Link></li>
        <li><Link to="/Home" className="text-dark">Home</Link></li>
        <li><Link to="/Electronics" className="text-dark">Electronics</Link></li>
      </ul>
      <div className="categories-desktop">
        <Link to="/login"> <i className="fa-solid fa-heart fs-4 mx-4 text-dark"></i>
          <i className="fa-solid fa-cart-shopping fs-4 text-dark"></i></Link>
      </div>
    </div>
  );
}

export default CategoriesNav;
