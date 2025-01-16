import React from 'react'
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../config/cookies';
import { readCookie, setCookie } from '../utils/cookie';
import LoginPage from '../pages/LoginPage';
import ROUTES from '../config/routes';

const ProtectedRoute = () => {
  const refreshtoken = readCookie(REFRESH_TOKEN, '');
  const location = useLocation();

  if (!refreshtoken) {
    return <Navigate to={{ pathname: ROUTES.LOGIN }} state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute
