import HomePage from '@pages/index';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const AppRoutes: React.FC<{}> = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
    </Routes>
  );
};

export default AppRoutes;
