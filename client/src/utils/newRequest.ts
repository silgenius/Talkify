import axios from "axios";

// Create axios instance
const newRequest = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_ORIGIN || "https://talkify.techerudites.tech"}/api`,
});

// Request interceptor to add the token to headers
newRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default newRequest;
