import axios from "axios";

const api = axios.create({
  baseURL: "https://e-commerce-website-backend-d84m.onrender.com/api",
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("➡️ API REQUEST:", config.url);
    console.log("🔑 TOKEN EXISTS:", !!token);

    if (!token) {
      console.warn("⚠️ No token found in localStorage");
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("❌ Request setup error:", error);
    return Promise.reject(error);
  },
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => {
    console.log("✅ RESPONSE:", response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error("❌ API ERROR:", {
      url: originalRequest?.url,
      status: error.response?.status,
      message: error.response?.data?.msg || error.message,
    });

    /* =========================
       JWT ERROR ANALYSIS
    ========================= */
    if (error.response?.status === 401) {
      const msg = error.response?.data?.msg;

      if (msg?.toLowerCase().includes("expired")) {
        console.warn("⏳ Token expired detected");

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          console.error("🚨 No refresh token found. User must login again.");
          return Promise.reject(error);
        }

        try {
          console.log("🔄 Trying to refresh token...");

          const res = await axios.post(
            "https://e-commerce-website-backend-d84m.onrender.com/api/refresh",
            { refreshToken },
          );

          const newToken = res.data.accessToken;

          localStorage.setItem("token", newToken);

          console.log("✅ Token refreshed successfully");

          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return api(originalRequest);
        } catch (refreshErr) {
          console.error("💀 Refresh failed. Force login.");
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          return Promise.reject(refreshErr);
        }
      }

      if (msg?.toLowerCase().includes("not valid")) {
        console.error("🚨 Invalid token detected (possible causes):");
        console.error("- Wrong JWT_SECRET on backend");
        console.error("- Corrupted token in localStorage");
        console.error("- Token signed with different secret");
      }

      if (msg?.toLowerCase().includes("malformed")) {
        console.error("🚨 Malformed token → frontend sending broken token");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
