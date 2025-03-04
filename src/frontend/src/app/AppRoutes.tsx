import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ROUTES from '../config/routes';

import AllLessonsPage from '../pages/courses/AllLessonsPage';
import MainPage from '../pages/courses/MainPage';

import WithQueryClient from './WithQueryClient';
import ProtectedRoute from './ProtectedRoute';
import AuthPage from '../pages/users/AuthPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProfilePage from '../pages/users/ProfilePage';
import CoursePage from '../pages/courses/CoursePage';
import LessonPage from '@/pages/courses/LessonPage';

const routesForAuthenticatedOnly = [
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      // {
      //   path: "/alllessons",
      //   element: <AllLessonsPage />,
      // },
      {
        path: "/",
        element: <AllLessonsPage />,
      },
      // {
      //   path: "/lesson/:lessonUUId",
      //   element: <CoursePage />,
      // },
      {
        path: "/lesson/:lessonUUId",
        element: <LessonPage />,
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
