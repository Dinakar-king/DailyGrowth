// Automatically uses localhost in local development and relative URL on Vercel
export const API_BASE =
  import.meta.env.MODE === "production"
    ? "/api"
    : "http://localhost:5000/api";

export const fetchWithAuth = async (endpoint, options = {}) => {
  const user = JSON.parse(localStorage.getItem("dg_user"));

  // Check if sending FormData (e.g. audio upload) vs JSON body
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...(user?.token && { Authorization: `Bearer ${user.token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};