import React from 'react'
import {  Outlet} from 'react-router-dom';
import HeaderInside from '../../components/common/HeaderInside/HeaderInside';
import AdminNavbar from '../../components/admin/AdminNavbar/AdminNavbar'
import './AdminLayoutPage.css'




const AdminLayoutPage = () => {
  return (
      <div>
        <div className='page-container'>
          <div className='top-header'>
            <HeaderInside />
          </div>
          <div className='content-box'>
            <div className='side-nav'>
              <AdminNavbar/>
            </div>
            <div className='content'>
             <Outlet/>
            </div>
          </div>
        </div>
      </div>

  )
}

export default AdminLayoutPage
