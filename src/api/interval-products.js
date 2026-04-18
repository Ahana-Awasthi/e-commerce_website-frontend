export async function fetchProducts() {
  console.log("HOOK MOUNTED");
  const res = await fetch(
    "https://e-commerce-website-backend-d84m.onrender.com/api/kids",
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}
