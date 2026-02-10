// src/axiosConfig.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '"http://20.246.74.138:8080/api/newprofile_get/"', // Change this to your Django server URL
});

export default axiosInstance;
