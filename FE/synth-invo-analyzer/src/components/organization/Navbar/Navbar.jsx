// Navbar.js

import React, { useState } from 'react';
import './navbar.css';
import { Layout } from 'antd';
import Logo from '../../common/Logo/Logo';
import MenuList from '../MenuList/MenuList';

const { Sider } = Layout;

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div>
      <Layout>
        <Sider className='sidebar' theme='light' collapsed={collapsed}>
          <Logo toggleCollapsed={toggleCollapsed} />
          <MenuList />
        </Sider>
      </Layout>
    </div>
  );
};

export default Navbar;
