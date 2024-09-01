import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = ({ children, token }) => {
  const path = window.location.pathname;

  const publicPaths = ['/sing-up', '/sing-in', '/verify-email',];
  const isPublicPath = publicPaths.includes(path);
  
  const user = Cookies.get('user');

  if (isPublicPath && user) {
    return <Navigate to="/" replace />;
  }

  if (!isPublicPath && !user) {
    return <Navigate to="/sing-in" replace />;
  }

  return children;
};

export default PrivateRoute;
