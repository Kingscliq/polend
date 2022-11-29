import { Reserves } from '@/types/Reserves';
import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { RootState } from '../../../store/types';
import { setReserves } from '../slices';

export const reserves = (state: RootState) => state.reserves;

export const useReserveActions = () => {
    const dispatch = useAppDispatch();
    // Set Reserve State
    return {
        setReserves: useCallback((reserves: Reserves) => dispatch(setReserves(reserves)), [dispatch]),
    };
};

// get Reserve State
export const useReserves = () => {
    return useAppSelector(reserves);
};
