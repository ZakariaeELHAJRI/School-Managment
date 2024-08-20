// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import headerReducer from './headerSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    header: headerReducer
  },
});

export default store;
