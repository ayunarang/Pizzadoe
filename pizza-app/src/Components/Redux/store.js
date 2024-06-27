import { configureStore } from '@reduxjs/toolkit';
import discountReducer from './reducers.js'; 

const store = configureStore({
  reducer: {
    discount: discountReducer,
  },
});

export default store;
