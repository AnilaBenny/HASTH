import axios from 'axios';
import Cookies from 'js-cookie';

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
    const accessToken = Cookies.get("accessToken"); 
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {

        const { data } = await axiosInstance.post('/api/auth/refresh-token', {
          token: Cookies.get('refreshToken'), 
        });

       
        Cookies.set('accessToken', data.accessToken, { secure: true, httpOnly: true });

        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

     
        return axiosInstance(originalRequest);
      } catch (refreshError) {
       
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/401'; 
      }
    } else if (error.response.status === 401) {
      window.location.href = '/401'; 
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
