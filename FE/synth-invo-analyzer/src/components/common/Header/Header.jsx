import React from "react";
import "../Header/header.css";
import Logo from "../../../assets/logo.svg";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <div className="header-box">
   
        <div className="logo">
        <Link to='/'>
          <img src={Logo} alt="Logo not available"></img>
          </Link>
        </div>
     
        <div className="header-btns">
          <Link to='/organization/signin' type="button" className="login-btn" style={{textDecoration:"none"}}>Login</Link>
          <Link to ='/organization/signup' type="button" className="signup-btn">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
