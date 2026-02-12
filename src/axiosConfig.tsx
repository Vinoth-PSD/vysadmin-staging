// src/axiosConfig.ts
import axios from 'axios';
import { apiUrl } from './api/apiUrl';

const axiosInstance = axios.create({
  baseURL: `${apiUrl.apiUrlConfig}api/newprofile_get/`, // Change this to your Django server URL
});

export default axiosInstance;
