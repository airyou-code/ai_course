import React, {useEffect} from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../config/cookies';
import { readCookie, setCookie } from '../utils/cookie';
import LoginPage from '../pages/LoginPage';
import ROUTES from '../config/routes';
import { useUserState } from '../hooks/user';

const ProtectedRoute = () => {
  const location = useLocation();
  const { hasFetched, loggedIn } = useUserState();

  if (!loggedIn) {
    return <Navigate to={{ pathname: ROUTES.LOGIN }} state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute
