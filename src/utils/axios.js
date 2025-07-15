import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL

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