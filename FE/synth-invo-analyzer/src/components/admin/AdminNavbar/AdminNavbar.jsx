import React, { useState } from 'react';
import { Layout } from 'antd';
import Logo from '../../common/Logo/Logo';
import AdminMenuList from '../AdminMenuList/AdminMenuList';

const { Sider } = Layout;

const AdminNavbar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div>
      <Layout>
        <Sider className='sidebar' theme='light' collapsed={collapsed}>
          <Logo toggleCollapsed={toggleCollapsed} />
          <AdminMenuList />
        </Sider>
      </Layout>
    </div>
  );
};

export default AdminNavbar;
