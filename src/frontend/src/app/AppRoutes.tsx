import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ROUTES from '../config/routes';

import AllLessonsPage from '../pages/cources/AllLessonsPage';
import CoursePage from '../pages/cources/CoursePage';

import WithQueryClient from './WithQueryClient';
import ProtectedRoute from './ProtectedRoute';
import AuthPage from '../pages/users/AuthPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProfilePage from '../pages/users/ProfilePage';

const routesForAuthenticatedOnly = [
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/alllessons",
        element: <AllLessonsPage />,
      },
      {
        path: ROUTES.PROFILE,
        element: <ProfilePage />,
      },
    ],
  },
]

const routesForNotAuthenticatedOnly = [
  {
    path: "/",
    element: <CoursePage />,
  },
  {
    path: ROUTES.LOGIN,
    element: <AuthPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export const APP_ROUTES = [
  ...routesForNotAuthenticatedOnly,
  ...routesForAuthenticatedOnly
]

const AppRoutes = () => {
  const router = createBrowserRouter(APP_ROUTES);
  return (
      <RouterProvider router={router} />
  );
};

export default AppRoutes;
