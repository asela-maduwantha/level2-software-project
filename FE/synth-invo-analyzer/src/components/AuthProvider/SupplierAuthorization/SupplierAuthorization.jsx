import React from 'react';
import UseAuthCheck from '../UseAuthCheck/UseAuthCheck';

const SupplierAuthorization = ({ children }) => {
  const tokenValid = UseAuthCheck('http://127.0.0.1:8000/auth/supplier/protected/', '/supplier/signin');

  if (!tokenValid) {
    return null;
  }
  return <>{children}</>;
};

export default SupplierAuthorization;
