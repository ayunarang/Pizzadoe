import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  discount: 0,
};

const discountSlice = createSlice({
  name: 'discount',
  initialState,
  reducers: {
    setDiscount(state, action) {
      state.discount = action.payload.discount;
    },
  },
});

export const { setDiscount } = discountSlice.actions;

export default discountSlice.reducer;

