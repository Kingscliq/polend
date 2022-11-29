import { useCallback } from 'react';
import { AlertState, removeAlert, setAlert } from 'slices/alertSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store/types';

export const alert = (state: RootState) => state.alert;

export const useAlertActions = () => {
  const dispatch = useAppDispatch();

  // Set alert State
  return {
    setAlert: useCallback(
      (alert: AlertState) => dispatch(setAlert(alert)),
      [dispatch],
    ),
    removeAlert: useCallback(
      (alert: AlertState) => dispatch(removeAlert(alert)),
      [dispatch],
    ),
  };
};

// get alert State
export const useAlert = () => {
  return useAppSelector(alert);
};
