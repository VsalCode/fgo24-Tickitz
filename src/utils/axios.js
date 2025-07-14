import axios from "axios";

// const baseUrl = import.meta.env.VITE_API_BASE_URL
const baseUrl = "http://146.190.102.54:9403"

function http(token = null) {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const instance = axios.create({
    baseURL: baseUrl, 
    headers,
  });
  
  return instance;
}

export default http;