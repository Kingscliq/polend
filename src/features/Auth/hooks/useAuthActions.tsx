import { useCallback } from 'react';
import { removeUser, setUser } from '../../../slices/authSlice';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { RootState } from '../../../store/types';
import { User } from '../../../types/User';
import useAuthConnect from './useAuthConnect';

export const user = (state: RootState) => state.user.user;

export const useAuthActions = () => {
  const dispatch = useAppDispatch();
  const { login, logout } = useAuthConnect();
  // Set user State
  return {
    setUser: useCallback((user: User) => dispatch(setUser(user)), [dispatch]),
    login: useCallback(
      (config: { connectorId: any; title: any }) => login(config),
      [login]
    ),
    logout: useCallback(() => logout(), []),
    removeUser: useCallback(() => dispatch(removeUser()), []),
  };
};

// get auth State
export const useAuth = () => {
  return useAppSelector(user);
};
