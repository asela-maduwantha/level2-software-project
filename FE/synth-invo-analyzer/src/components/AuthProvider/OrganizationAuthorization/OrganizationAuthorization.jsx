import React from 'react';
import UseAuthCheck from '../UseAuthCheck/UseAuthCheck';

const OrganizationAuthorization = ({ children }) => {
  const tokenValid = UseAuthCheck('http://127.0.0.1:8000/auth/organization/protected/', '/organization/signin');

  if (!tokenValid) {
    return null;
  }
  return <>{children}</>;
};

export default OrganizationAuthorization;
