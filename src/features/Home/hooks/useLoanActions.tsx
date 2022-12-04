import { BorrowProps, SupplyProps } from '@/types/Loan';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { RootState } from '@store/types';
import { useCallback } from 'react';
import { setBorrowData, setSupplyData } from '../Home.store';

export const borrowData = (state: RootState) => state.lend.borrowData;
export const supplyData = (state: RootState) => state.lend.supplyData;

export const useLoanActions = () => {
    const dispatch = useAppDispatch();

    // Set alert State
    return {
        setSupplyData: useCallback(
            (supplyData: SupplyProps) => dispatch(setSupplyData(supplyData)),
            [dispatch],
        ),
        setBorrowData: useCallback(
            (alert: BorrowProps) => dispatch(setBorrowData(alert)),
            [dispatch],
        ),
    };
};

// get Supply State
export const useSupply = () => {
    return useAppSelector(supplyData);
};
// get Borrow State
export const useBorrow = () => {
    return useAppSelector(borrowData);
};
