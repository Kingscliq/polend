import { combineReducers, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import storage from 'redux-persist/lib/storage';
import type { WebStorage } from 'redux-persist';
import { persistReducer } from 'redux-persist';
import Auth from '../slices/authSlice';
import Language from '../slices/languageSlice';
import Alert from '../slices/alertSlice'
import Lend from '@features/Home/Home.store'

import {
  initMessageListener,
} from "redux-state-sync";

interface PersitConfig {
  key: string;
  storage: WebStorage;
}

export const persistConfig: PersitConfig = {
  key: 'root',
  storage: storage,
};

const rootReducer = combineReducers({
  user: Auth.reducer,
  language: Language.reducer,
  alert: Alert.reducer,
  lend: Lend.reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const getMiddlewares = (getDefaultMiddlewares: any) => {
  if (process.env.NODE_ENV !== 'development') return [...getDefaultMiddlewares()];
  return [...getDefaultMiddlewares(), logger];
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getMiddlewares,
});


initMessageListener(store);