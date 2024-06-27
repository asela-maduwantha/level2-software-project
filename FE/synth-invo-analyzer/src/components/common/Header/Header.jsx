import React from "react";
import "../Header/header.css";
import Logo from "../../../assets/logo.svg";
import { Link } from "react-router-dom";
import { Button } from 'antd';

const Header = () => {
  return (
    <div className="header">
      <div className="header-box">
        <div className="logo">
          <Link to='/'>
            <img src={Logo} alt="Logo not available" />
          </Link>
        </div>
        <div className="header-btns">
          <Link to='/organization/signin'>
            <Button type="primary" className="login-btn">Login</Button>
          </Link>
          <Link to='/organization/signup'>
            <Button type="default" className="signup-btn">Signup</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
