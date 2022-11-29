import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { RootState } from '../../../store/types';
import { setPoolInfo, setUserInfo, setwbnbPrice } from '../Loan.store';

export const loan = (state: RootState) => state.loan;

export const useLoanActions = () => {
  const dispatch = useAppDispatch();

  return {
    setUserInfo: useCallback(
      (userInfo: any) => dispatch(setUserInfo(userInfo)),
      [dispatch],
    ),
    setPoolInfo: useCallback(
      (poolInfo: {}) => dispatch(setPoolInfo(poolInfo)),
      [dispatch],
    ),
    setwbnbPrice: useCallback(
      (wbnbPrice: number) => dispatch(setwbnbPrice(wbnbPrice)),
      [dispatch],
    ),
  };
};

export const useLoan = () => {
  return useAppSelector(loan);
};
