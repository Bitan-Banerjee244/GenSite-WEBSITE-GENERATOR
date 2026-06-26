import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: true,
    refreshPage: true,
  },

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    toggleRefresh: (state, action) => {
      state.refreshPage = !state.refreshPage;
    },
  },
});

export const { setUserData, setLoading, toggleRefresh } = userSlice.actions;
export default userSlice.reducer;
