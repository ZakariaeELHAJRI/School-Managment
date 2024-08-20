// store/headerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const data = {
  title: "All Courses",
  breadcrumbs: [
    { label: 'Home', href: '#' },
    { label: 'Courses', href: '#' },
    { label: 'All', href: null }
  ],
  addNewLabel: "Add New Courses",
  addNewHref: "#"
};
const data1 = {
  title: 'Analytics',
  datePicker: true,
  settingLink: '#',
};
const data2 = {
  title: 'Instructor',
  breadcrumbs: [
    { label: 'Dashboard', href: '/' },
    { label: 'User', href: '/user' },
    { label: 'Instructor' },
  ],
  viewToggle: true,
};
const initialState = {
  title: "All Courses",
  breadcrumbs: [
    { label: 'Home', href: '#' },
    { label: 'Courses', href: '#' },
    { label: 'All', href: null }
  ],
  addNewLabel: "Add New Courses",
  addNewHref: "#"
};

const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    updateHeaderData: (state, action) => {
      return { ...state, ...action.payload };
    }
  }
});

export const { updateHeaderData } = headerSlice.actions;
export default headerSlice.reducer;
