import axios from 'axios';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8081/api/',
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log(err);
    if (err.response.status === 403) {
      toast.error('Session expired! Please login again.');
      window.location.pathname = '/';
    }
    toast.error(err.response.data.error);
    throw new Error(err.response.data.error);
    // return err;
  },
);

export default axiosInstance;
