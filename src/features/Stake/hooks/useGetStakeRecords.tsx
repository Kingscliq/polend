
import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { RootState } from '../../../store/types';
import { setStakeRecords, setUnStakeItem, updateStakeRecords } from '../Stake.store';
import { StakeRecords } from '@/types/StakeRecords';

export const stakeRecords = (state: RootState) => state.stakeRecords;

export const useStakeActions = () => {
    const dispatch = useAppDispatch();
    // Set Stake Records State
    return {
        setStakeRecords: useCallback((records: StakeRecords[]) => dispatch(setStakeRecords(records)), [dispatch]),
        setUnStakeItem: useCallback((record: StakeRecords) => dispatch(setUnStakeItem(record)), [dispatch]),
        updateStakeRecords: useCallback((record: StakeRecords) => dispatch(updateStakeRecords(record)), [dispatch]),
    };
};

// get Stake State
export const useStake = () => {
    return useAppSelector(stakeRecords);
};
