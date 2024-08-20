import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
});

const token = '2|Cj0Aix3S4KrOb94jk0ElKHVA2ibeNVmf033StavV3aadecee';

axiosInstance.interceptors.request.use(
    (config) => {
        config.headers.Authorization = `Bearer ${token}`;
        // config.headers['Content-Type'] = 'application/json';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
