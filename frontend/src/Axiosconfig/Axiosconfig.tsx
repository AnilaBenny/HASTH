
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 100000, 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});


axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config; 
  },
  (error) => {
    return Promise.reject(error); 
  }
);



export default axiosInstance;
