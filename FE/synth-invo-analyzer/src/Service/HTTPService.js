import axios from 'axios';

// Create an Axios instance
const instance = axios.create({
  baseURL: 'http://localhost:8000/',
  timeout: 50000, // Adjusted to 50 seconds
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

// Request interceptor to add the token to the headers
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    if (token) {
      config.headers.Authorization = `${token}`; // Add the token to the headers
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
    if (error.response !== undefined && error.response.status === 402) {
      console.log('error' + error);
      window.location = '/';
    } else {
      let msg = 'Cannot find the Server';
      if (
        error.response.data !== undefined &&
        error.response.data.message !== undefined
      ) {
        msg = error.response.data.message;
        return Promise.reject(msg);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
