import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import './Logout.css'; // Add a separate CSS file for the Logout button styles

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <Button type="primary" className="logout-btn" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;
