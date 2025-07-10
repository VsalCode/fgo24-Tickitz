import axios from "axios";

// const instance = axios.create({
//   baseURL: "https://api.themoviedb.org/3",
// });

// export default instance;

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