import React from 'react';
import styled from 'styled-components';
import Logo from '../../../assets/logo.svg';
import { Link } from 'react-router-dom';
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
  margin: auto;
`;

const LogoContainer = styled.div`
  height: 50px;
`;

const HeaderButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StyledButton = styled(Button)`
  border-radius: 25px;
  height: 40px;
  width: 100px;
  font-weight: 500;

  &.login-btn {
    background: #6760ef;
    border-color: #6760ef;

    &:hover {
      background: #fff;
      color: #6760ef;
      border-color: #6760ef;
    }
  }

  &.signup-btn {
    background: #fff;
    color: #6760ef;
    border-color: #6760ef;

    &:hover {
      background: #6760ef;
      color: #fff;
      border-color: #fff;
    }
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoContainer>
          <Link to='/'>
            <img src={Logo} alt="Logo not available" style={{ height: '100%' }} />
          </Link>
        </LogoContainer>
        <HeaderButtons>
          <Link to='/organization/signin'>
            <StyledButton type="primary" className="login-btn">Login</StyledButton>
          </Link>
          <Link to='/organization/signup'>
            <StyledButton type="default" className="signup-btn">Signup</StyledButton>
          </Link>
        </HeaderButtons>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
