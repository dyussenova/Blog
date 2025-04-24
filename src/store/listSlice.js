import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch } from '../utils/authFetch';

export const fetchList = createAsyncThunk(
  'list/fetchList',
  async function (page = 1, { rejectWithValue }) {
    const limit = 5;
    const offset = (page - 1) * 5;
    try {
      const respone = await fetch(
        `https://blog-platform.kata.academy/api/articles?limit=${limit}&offset=${offset}`
      );
      if (!respone.ok) {
        throw new Error('Server Error');
      }
      const data = await respone.json();
      return { articles: data.articles, total: data.articlesCount };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSinglePage = createAsyncThunk(
  'list/fetchSinglePage',
  async function (slug, { rejectWithValue }) {
    try {
      const respone = await fetch(
        `https://blog-platform.kata.academy/api/articles/${slug}`
      );
      if (!respone.ok) {
        throw new Error('Server Error');
      }
      const data = await respone.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteArticle = createAsyncThunk(
  'list/deleteArticle',
  async function (slug, { rejectWithValue }) {
    try {
      const response = await authFetch(
        `https://blog-platform.kata.academy/api/articles/${slug}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete article');
      }

      return slug;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateArticle = createAsyncThunk(
  'list/updateArticle',
  async function ({ slug, updatedData }, { rejectWithValue, getState }) {
    const { list } = getState().list;

    const oldArticle = list.find((article) => article.slug === slug);

    try {
      const response = await authFetch(
        `https://blog-platform.kata.academy/api/articles/${slug}`,
        {
          method: 'PUT',

          body: JSON.stringify({ article: updatedData }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update article');
      }

      const data = await response.json();

      return { newArticle: data.article, oldArticle };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const toggleLike = createAsyncThunk(
  'list/toggleLike',
  async ({ slug, liked }, { rejectWithValue }) => {
    try {
      const response = await authFetch(
        `https://blog-platform.kata.academy/api/articles/${slug}/favorite`,
        {
          method: liked ? 'DELETE' : 'POST',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const data = await response.json();
      return data.article;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const listSlice = createSlice({
  name: 'list',
  initialState: {
    list: [],
    singlePage: null,
    status: null,
    error: null,
    total: 0,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchList.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchList.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.list = action.payload.articles;
        state.total = action.payload.total;
      })
      .addCase(fetchList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchSinglePage.pending, (state) => {
        state.singlePage = null;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSinglePage.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.singlePage = action.payload;
      })
      .addCase(fetchSinglePage.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteArticle.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.list = state.list.filter(
          (article) => article.slug !== action.payload
        );
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(updateArticle.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.status = 'resolved';
        const updated = action.payload.newArticle;

        state.list = state.list.map((article) =>
          article.slug === updated.slug ? updated : article
        );
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const updatedArticle = action.payload;
        const index = state.list.findIndex(
          (article) => article.slug === updatedArticle.slug
        );
        if (index !== -1) {
          state.list[index] = updatedArticle;
        }

        if (state.singlePage?.article?.slug === updatedArticle.slug) {
          state.singlePage.article = updatedArticle;
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export default listSlice.reducer;
