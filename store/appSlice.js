// store/appSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { settings } from '../app.config';

const initialState = {
  skin: settings.theme.skin
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    changeSkin: (state, action) => {
      document.querySelector('html').setAttribute('data-theme', action.payload);
      state.skin = action.payload;
    },
  },
});

export const { changeSkin } = appSlice.actions;

export default appSlice.reducer;
