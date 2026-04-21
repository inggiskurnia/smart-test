import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 3000,
});

export default axiosInstance;
