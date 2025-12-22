import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null, // ✅ Start with null, let useLoadUser fetch fresh data
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      console.log('🔄 Setting user in Redux:', action.payload);
      state.user = action.payload;
      
      // ✅ Save to localStorage only for persistence between page refreshes
      if (action.payload) {
        localStorage.setItem('jobportal_user', JSON.stringify(action.payload));
        console.log('✅ User saved to localStorage');
      } else {
        localStorage.removeItem('jobportal_user');
        console.log('🗑️ User removed from localStorage');
      }
    },
    logout: (state) => {
      console.log('🚪 Logging out user');
      state.user = null;
      localStorage.removeItem('jobportal_user');
    },
  },
});

export const { setLoading, setUser, logout } = authSlice.actions;
export default authSlice.reducer;