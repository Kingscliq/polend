import HomePage from '@pages/index';
import LiquidityPage from '@pages/liquidity';
import LotteryPage from '@pages/lottery';
import PortfolioPage from '@pages/portfolio/PoolAnalytics';
import PortfolioLuckyBagsPage from '@pages/portfolio/PortfolioLuckyBags';
import PortfolioStakeAnalyticsPage from '@pages/portfolio/PortfolioStakeAnalytics';
import StakePage from '@pages/stake';
import SwapPage from '@pages/swap';
import Test from '@pages/test';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoanRouter from '@pages/loan/LoanRouter';

const AppRoutes: React.FC<{}> = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/learn-more" element={<SwapPage />}></Route>
      <Route
        path="/market"
        element={<PortfolioStakeAnalyticsPage />}
      ></Route>
      <Route path="/loan/*" element={<LoanRouter />}></Route>

    </Routes>
  );
};

export default AppRoutes;
