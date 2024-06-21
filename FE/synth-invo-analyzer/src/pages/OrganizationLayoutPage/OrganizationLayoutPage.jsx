import React from 'react';
import HeaderInside from '../../components/common/HeaderInside/HeaderInside';
import Navbar from '../../components/organization/Navbar/Navbar';
import './OrganizationLayoutPage.css';
import { Outlet } from 'react-router-dom';


const OrganizationLayoutPage = () => {
  return (
   
      <div>
        <div className='page-container'>
          <div className='top-header'>
            <HeaderInside />
          </div>
          <div className='content-box'>
            <div className='side-nav'>
              <Navbar />
            </div>
            <div className='content'>
              <Outlet/>
            </div>
          </div>
        </div>
      </div>

  );
};

export default OrganizationLayoutPage;
