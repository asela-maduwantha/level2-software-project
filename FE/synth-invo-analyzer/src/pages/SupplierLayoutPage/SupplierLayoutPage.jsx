import React from 'react'
import {  Outlet} from 'react-router-dom';
import HeaderInside from '../../components/common/HeaderInside/HeaderInside';
import AdminNavbar from '../../components/admin/AdminNavbar/AdminNavbar'
import './SupplierLayoutPage.css'
import SupplierNavbar from '../../components/supplier/SupplierNavbar/SupplierNavbar';




const SupplierLayoutPage = () => {
  return (
      <div>
        <div className='page-container'>
          <div className='top-header'>
            <HeaderInside />
          </div>
          <div className='content-box'>
            <div className='side-nav'>
              <SupplierNavbar/>
            </div>
            <div className='content'>
             <Outlet/>
            </div>
          </div>
        </div>
      </div>

  )
}

export default SupplierLayoutPage
