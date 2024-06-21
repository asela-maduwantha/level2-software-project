// HomePage.js

import React from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";
import Header from "../../components/common/Header/Header";


const HomePage = () => {
  return (
    <div>
      <Header />
      <div className="circle">
        <div className="description-box">
          <div className="home-text">
            <p>
              Standardize, <br />
              Analyze and
              <br />
              Visualize Invoices. <br />
            </p>
          </div>
          <div className="home-list">
            <h2>Revolutionize Your Business Transactions</h2>
            <ul>
              <li>
                <span>Automate</span> invoice management
              </li>
              <li>
                <span>Accept</span> any invoice type
              </li>
              <li>
                <span>Analyze</span> your invoices in real time
              </li>
            </ul>
          </div>
          <div className="home-btns">
            <Link to="/organization/signup" className="signup-btn">
              Signup for free
            </Link>
            <Link to="/pricing" className="pricing-btn">
              See pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
