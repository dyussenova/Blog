import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'login/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        'https://blog-platform.kata.academy/api/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: {
              email: loginData.email,
              password: loginData.password,
            },
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();

        return rejectWithValue(errorData.errors);
      }
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Request failed:', error);
      return rejectWithValue({ general: 'Something went wrong' });
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    user: JSON.parse(localStorage.getItem('login')) || null,
    token: localStorage.getItem('token') || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('login');
      localStorage.removeItem('token');
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('login', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.token = action.payload.token;
        localStorage.setItem('login', JSON.stringify(action.payload));
        localStorage.setItem('token', action.payload.token);
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout, setUser } = loginSlice.actions;
export default loginSlice.reducer;
