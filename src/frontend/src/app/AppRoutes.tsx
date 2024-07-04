import { Routes, Route } from 'react-router-dom';

import ROUTES from '../config/routes';

import MainPage from '../pages/MainPage';
import UsersPage from '../pages/UsersPage';
import TestPage from '../pages/TestPage';

import WithQueryClient from './WithQueryClient';

const AppRoutes = () => {
  return (
    <WithQueryClient>
      <Routes>
        <Route path={ROUTES.INDEX} element={<MainPage />} />
        <Route path={"/users"} element={<UsersPage/>} />
        <Route path={"/test"} element={<TestPage />} />
      </Routes>
    </WithQueryClient>
  );
};

export default AppRoutes;
