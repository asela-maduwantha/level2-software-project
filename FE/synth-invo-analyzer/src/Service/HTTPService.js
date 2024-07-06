import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/',
  timeout: 50000,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response !== undefined) {
      if (error.response.status === 402) {
        window.location = '/';
      } else if (error.response.status === 307) {
        const redirectUrl = error.response.headers.location;
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      } else {
        let msg = 'Cannot find the Server';
        if (
          error.response.data !== undefined &&
          error.response.data.message !== undefined
        ) {
          msg = error.response.data.message;
        }
        return Promise.reject(msg);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
