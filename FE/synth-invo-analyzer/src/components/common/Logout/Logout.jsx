import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const buttonStyle = {
    height: '40px',
    width: '120px',
    background: '#6760ef',
    border: '2px solid #ffff',
    borderRadius: '25px',
    display: 'flex', // To use align-items and justify-content
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffff',
    textAlign: 'center',
    fontWeight: '500',
    padding: '1%',
    cursor: 'pointer' // Adds a pointer cursor to indicate it's clickable
  };

  return (
    <button style={buttonStyle} onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
