import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage on app start
const loadUserFromStorage = () => {
  try {
    const savedUser = localStorage.getItem('jobportal_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      console.log('🔄 Loading user from localStorage:', parsedUser);
      return parsedUser;
    }
    return null;
  } catch (error) {
    console.error('❌ Error loading user from localStorage:', error);
    localStorage.removeItem('jobportal_user');
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: loadUserFromStorage(),
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      console.log('🔄 Setting user in Redux:', action.payload);
      state.user = action.payload;
      
      // Save to localStorage
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