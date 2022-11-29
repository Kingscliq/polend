import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AssetPage from './index';
import DepositPage from './DepositPage';
import BorrowPage from './BorrowPage';
import WithdrawPage from './WithdrawPage';
import RepayPage from './RepayPage';

const LoanRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AssetPage />} />
      <Route path="/deposit" element={<DepositPage />} />
      <Route path="/borrow" element={<BorrowPage />} />
      <Route path="/withdraw" element={<WithdrawPage />} />
      <Route path="/repay" element={<RepayPage />} />
    </Routes>
  );
};

export default LoanRouter;
