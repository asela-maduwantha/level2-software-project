import React from "react";
import "./headerinside.css";
import Logo from "../../../assets/logo.svg";
import { Link } from "react-router-dom";
import Logout from "../Logout/Logout";
import { Button } from 'antd';

const HeaderInside = () => {
  return (
    <div className="header">
      <div className="header-box">
        <Link to='/'>
          <div className="logo">
            <img src={Logo} alt="Logo not available" />
          </div>
        </Link>
        <div className="header-btns">
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default HeaderInside;
