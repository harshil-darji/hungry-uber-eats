import axios from 'axios';

export default axios.create({
  baseURL: 'http://127.0.0.1:8080/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// axiosInstance.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response.status === 403) {
//       toast('Session expired! Please login again.');
//     }
//     return err;
//   },
// );

// export default axiosInstance;
