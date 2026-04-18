import { useEffect, useRef, useState } from "react";
import { fetchProducts } from "../api/interval-products";

const MINUTES = 60 * 1000;
const TIME_INTERVAL = 10 * MINUTES;

export function useProductsAutoFetch() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const lastFetchRef = useRef(0);

  const load = async () => {
    const now = Date.now();

    // prevent accidental double fetches
    if (now - lastFetchRef.current < TIME_INTERVAL) return;

    try {
      setLoading(true);

      const data = await fetchProducts();
      setProducts(data);

      lastFetchRef.current = now;

      console.log("FETCH DONE:", new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(); // run immediately

    const interval = setInterval(load, TIME_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return { products, loading, reload: load };
}
