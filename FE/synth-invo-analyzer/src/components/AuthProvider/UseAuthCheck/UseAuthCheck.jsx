import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UseAuthCheck = (endpoint, signinPath) => {
  const [tokenValid, setTokenValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found in local storage");
      navigate(signinPath);
      return;
    }

    axios.get(endpoint, {
      headers: {
        'Authorization': `${token}`,  
      }
    })
    .then(response => {
      if (response.status === 200) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
        navigate(signinPath);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setTokenValid(false);
      navigate(signinPath);
    });
  }, [endpoint, signinPath, navigate]);

  return tokenValid;
};

export default UseAuthCheck;
