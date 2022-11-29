import { User } from '../types/User';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
interface AuthState {
    user: User;
}

const initialState: AuthState = {
    user: {
        address: "", provider: ""
    }
}

export const AuthSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state: AuthState, action: PayloadAction<User>) => {
            state.user = action.payload
        },
        removeUser: (state: AuthState) => {
            state.user.address = ''
            state.user.provider = {}
        },
    },
});

export const { setUser, removeUser } = AuthSlice.actions;
export default AuthSlice;
