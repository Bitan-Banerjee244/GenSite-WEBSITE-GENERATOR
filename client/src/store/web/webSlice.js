import { createSlice } from "@reduxjs/toolkit";

const webSlice = createSlice({
  name: "web",
  initialState: {
    websiteData: null,
  },
  reducers: {
    setCurrentWebsite: (state, action) => {
      state.websiteData = action.payload;
    },
  },
});

export const { setCurrentWebsite } = webSlice.actions;
export default webSlice.reducer;
