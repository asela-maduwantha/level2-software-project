import React from 'react';
import styled from 'styled-components';
import Logo from '../../../assets/logo.svg';
import { Link } from 'react-router-dom';
import Logout from '../Logout/Logout';
import { Button } from 'antd';

const HeaderContainer = styled.div`
  background-color: #6760ef;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  max-width: 1200px;
  margin: 0 auto;
`;

const LogoContainer = styled.div`
  height: 50px;
`;

const HeaderInside = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoContainer>
          <Link to='/'>
            <img src={Logo} alt="Logo not available" style={{ height: '100%' }} />
          </Link>
        </LogoContainer>
        <div className="header-btns">
          <Logout />
        </div>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default HeaderInside;
