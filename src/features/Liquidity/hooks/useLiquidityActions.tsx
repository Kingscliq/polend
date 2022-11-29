import { LiquidityBalancesProp } from '@/types/Liquidity';
import { SelectedProps } from '@components/elements/DropdownModal';
import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { RootState } from '../../../store/types';
import {
  setSelectedCurrency,
  setSelectedCurrency1,
  setPrice0,
  setPrice1,
  setBalance,
  setBalance1,
  setPerPrice,
  setAllowPrice0,
  setAllowPrice1,
  setAllow0,
  setAllow1,
  setAvailableBalance,
  setStatus,
  setLiquidityBalances,
  setPool0,
  setPool1,
  setTotalPool,
  setRemove,
  updateBalance,
} from '../Liquidity.store';

export const liquidity = (state: RootState) => state.liquidity;

export const useLiquidityActions = () => {
  const dispatch = useAppDispatch();
  // Set Reserve State
  return {
    setSelectedCurrency: useCallback(
      (selectedCurrency: SelectedProps) =>
        dispatch(setSelectedCurrency(selectedCurrency)),
      [dispatch],
    ),
    setSelectedCurrency1: useCallback(
      (selectedCurrency1: SelectedProps) =>
        dispatch(setSelectedCurrency1(selectedCurrency1)),
      [dispatch],
    ),
    setPrice0: useCallback(
      (price0: string) => dispatch(setPrice0(price0)),
      [dispatch],
    ),
    setPrice1: useCallback(
      (price1: string) => dispatch(setPrice1(price1)),
      [dispatch],
    ),
    setBalance: useCallback(
      (balance: number) => dispatch(setBalance(balance)),
      [dispatch],
    ),
    setBalance1: useCallback(
      (balance1: number) => dispatch(setBalance1(balance1)),
      [dispatch],
    ),
    setPerPrice: useCallback(
      (perPrice: number[]) => dispatch(setPerPrice(perPrice)),
      [dispatch],
    ),
    setAllowPrice0: useCallback(
      (allowPrice0: number) => dispatch(setAllowPrice0(allowPrice0)),
      [dispatch],
    ),
    setAllowPrice1: useCallback(
      (allowPrice1: number) => dispatch(setAllowPrice1(allowPrice1)),
      [dispatch],
    ),
    setAllow0: useCallback(
      (allow0: boolean) => dispatch(setAllow0(allow0)),
      [dispatch],
    ),
    setAllow1: useCallback(
      (allow1: boolean) => dispatch(setAllow1(allow1)),
      [dispatch],
    ),
    setAvailableBalance: useCallback(
      (availableBalance: boolean) =>
        dispatch(setAvailableBalance(availableBalance)),
      [dispatch],
    ),
    setStatus: useCallback(
      (status: boolean) => dispatch(setStatus(status)),
      [dispatch],
    ),
    setLiquidityBalances: useCallback(
      (balances: LiquidityBalancesProp[]) =>
        dispatch(setLiquidityBalances(balances)),
      [dispatch],
    ),
    setPool0: useCallback(
      (pool0: number) => dispatch(setPool0(pool0)),
      [dispatch],
    ),
    setPool1: useCallback(
      (pool1: number) => dispatch(setPool1(pool1)),
      [dispatch],
    ),
    setTotalPool: useCallback(
      (totalPool: number) => dispatch(setTotalPool(totalPool)),
      [dispatch],
    ),
    setRemove: useCallback(
      (remove: {}) => dispatch(setRemove(remove)),
      [dispatch],
    ),
    updateLiquidityBalance: useCallback(
      (balance: any) => {
        dispatch(updateBalance(balance));
      },
      [dispatch],
    ),
  };
};

// get Reserve State
export const useLiquidity = () => {
  return useAppSelector(liquidity);
};
