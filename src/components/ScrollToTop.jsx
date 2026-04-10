// ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTopFast = () => {
      let current = window.scrollY;
      const step = 5000; // higher = faster
      const interval = setInterval(() => {
        if (current <= 0) {
          clearInterval(interval);
        } else {
          current -= step;
          window.scrollTo(0, current);
        }
      }, 5); // smaller interval = smoother/faster
    };

    scrollToTopFast();
  }, [pathname]);

  return null;
}