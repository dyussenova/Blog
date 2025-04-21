import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const updateProfile = createAsyncThunk(
  'edit/updateProfile',
  async (updatedUserData, { rejectWithValue, getState }) => {
    const { token } = getState().login;
    try {
      const response = await fetch(
        'https://blog-platform.kata.academy/api/user',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            user: updatedUserData,
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

const editSlice = createSlice({
  name: 'edit',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    resetEditStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetEditStatus } = editSlice.actions;
export default editSlice.reducer;
