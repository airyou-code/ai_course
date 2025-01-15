import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ROUTES from '../config/routes';

import MainPage from '../pages/MainPage';
import PersonsPage from '../pages/PersonsPage';
import TestPage from '../pages/TestPage';
import ProductsPage from '../pages/ProductsPage';
import TasksPage from '../pages/TasksPage';
import LoginPage from '../pages/LoginPage';
import AllLessonsPage from '../pages/cources/AllLessonsPage';
import CoursePage from '../pages/cources/CoursePage';

import WithQueryClient from './WithQueryClient';
import ProtectedRoute from './ProtectedRoute';
import AuthPage from '../pages/users/AuthPage';

const routesForAuthenticatedOnly = [
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <div>User Home Page</div>,
      },
      {
        path: "/tasks",
        element: <TasksPage />,
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
    path: "/alllessons",
    element: <AllLessonsPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
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


    // <WithQueryClient>
    //   <Routes>
    //     <Route path={ROUTES.INDEX} element={<MainPage />} />
    //     {/* <Route path={"/persons"} element={<PersonsPage/>} /> */}
    //     <Route path={"/test"} element={<TestPage />} />
    //     <Route path={"/products"} element={
    //       <ProtectedRoute>
    //         <ProductsPage />
    //       </ProtectedRoute>
    //     }
    //     />
    //     <Route path={"/tasks"} element={
    //       <ProtectedRoute>
    //         <TasksPage />
    //       </ProtectedRoute>
    //     }
    //     />
    //     <Route path={"/login"} element={<LoginPage />} />
    //   </Routes>
    // </WithQueryClient>
  );
};

export default AppRoutes;
