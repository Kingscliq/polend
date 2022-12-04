import HomePage from '@pages/index';
import Market from '@pages/market';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const AppRoutes: React.FC<{}> = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/market" element={<Market />}></Route>
    </Routes>
  );
};

export default AppRoutes;
