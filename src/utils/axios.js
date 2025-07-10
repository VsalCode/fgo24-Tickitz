import axios from "axios";

const baseUrl = "http://localhost:8080";

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