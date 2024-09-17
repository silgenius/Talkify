import axios from "axios";

const newRequest = axios.create({
  baseURL: import.meta.env.VITE_API_SERVER || "http://3.84.222.216:5000/api",
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
  },
});

export default newRequest;
