import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch } from '../utils/authFetch';

export const createArticle = createAsyncThunk(
  'createart/createArticle',
  async (articleData, { rejectWithValue }) => {
    try {
      const response = await authFetch(
        'https://blog-platform.kata.academy/api/articles',
        {
          method: 'POST',

          body: JSON.stringify({
            article: {
              title: articleData.title,
              description: articleData.description,
              body: articleData.body,
              tagList: articleData.tagList || [],
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.errors);
      }

      const data = await response.json();
      return data.article;
    } catch (error) {
      return rejectWithValue({
        general: 'Ошибка при создании статьи',
        details: error.message,
      });
    }
  }
);

const createArtSlice = createSlice({
  name: 'createart',
  initialState: {
    article: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    resetCreateArticleStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createArticle.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.article = action.payload;
        state.error = null;
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetCreateArticleStatus } = createArtSlice.actions;
export default createArtSlice.reducer;
