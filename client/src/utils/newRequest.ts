import axios from "axios";

const newRequest = axios.create({
  baseURL: "http://3.84.222.216:5000/api",
});

export default newRequest;
