import React from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../config/cookies';
import { readCookie, setCookie } from '../utils/cookie';
import LoginPage from '../pages/LoginPage';

const ProtectedRoute = () => {
  const refreshtoken = readCookie(REFRESH_TOKEN, '');

  if (!refreshtoken) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default ProtectedRoute
