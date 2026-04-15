import API from "./axios";

//  Login
export const loginUser = (data) => API.post("/auth/login", data);

//  Register
export const registerUser = (data) => API.post("/auth/register", data);

// Get current user
export const getCurrentUser = () => API.get("/auth/me");

// Logout
export const logoutUser = () => API.post("/auth/logout");
