import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  cart: any | null;
}

const initialState: CartState = {
  cart:null
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction) => {
        state.cart = action.payload
        localStorage.setItem("cart", JSON.stringify(state.cart));
      },
      clearCart: (state) => {
        state.cart = null;
        localStorage.removeItem("cart");
      },
      updateQuantity: (state, action: PayloadAction<{ itemId: string, quantity: number }>) => {
        if (state.cart) {
          const item = state.cart.items.find((item:any) => item._id === action.payload.itemId);
          if (item) {
            item.quantity = action.payload.quantity;
            state.cart.totalPrice = state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
            localStorage.setItem("cart", JSON.stringify(state.cart));
          }
        }
      },
      removeFromCart: (state, action: PayloadAction<string>) => {
        if (state.cart) {
          state.cart.items = state.cart.items.filter(item => item._id !== action.payload);
          state.cart.totalPrice = state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
          if (state.cart.items.length === 0) {
            state.cart = null;
            localStorage.removeItem("cart");
          } else {
            localStorage.setItem("cart", JSON.stringify(state.cart));
          }
        }
      }, updateTotalPrice: (state, action: PayloadAction<number>) => {
        if (state.cart) {
          state.cart.totalPrice = action.payload;
          localStorage.setItem("cart", JSON.stringify(state.cart));
        }
      },
    },
});

export const { addToCart, clearCart, updateQuantity,removeFromCart,updateTotalPrice } = cartSlice.actions;
export const selectCart = (state: { cart: CartState }) => state.cart.cart;
export default cartSlice.reducer;