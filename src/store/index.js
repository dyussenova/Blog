import { configureStore } from '@reduxjs/toolkit';
import listReducer from './listSlice';
import userReducer from './userSlice';
import loginReducer from './loginSlice';
import editReducer from './editSlice';
import createArtReducer from './createArtSlice';

export default configureStore({
  reducer: {
    list: listReducer,
    user: userReducer,
    login: loginReducer,
    edit: editReducer,
    create: createArtReducer,
  },
});
