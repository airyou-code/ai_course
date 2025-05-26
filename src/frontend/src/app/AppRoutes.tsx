import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ROUTES from '../config/routes';

import AllLessonsPage from '../pages/courses/AllLessonsPage';

import ProtectedRoute from './ProtectedRoute';
import AuthPage from '../pages/users/AuthPage';
import PaymentPage from '@/pages/payments/PaymentPage';
import SuccessPage from '@/pages/payments/SuccessPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProfilePage from '../pages/users/ProfilePage';
import LessonPage from '@/pages/courses/LessonPage';
import RegistrationPage from '@/pages/users/RegistrationPage';

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
      {
        path: ROUTES.PAYMENT,
        element: <PaymentPage />,
      },
      {
        path: ROUTES.SUCCESS_PAYMENT,
        element: <SuccessPage />,
      }
    ],
  },
]

const routesForNotAuthenticatedOnly = [
  {
    path: ROUTES.LOGIN,
    element: <AuthPage />,
  },
  {
    path: "/register",
    element: <RegistrationPage />,
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
