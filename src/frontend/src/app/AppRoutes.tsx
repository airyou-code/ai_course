import { Routes, Route } from 'react-router-dom';

import ROUTES from '../config/routes';

import MainPage from '../pages/MainPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.INDEX} element={<MainPage />} />
    </Routes>
  );
};

export default AppRoutes;
