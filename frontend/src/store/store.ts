import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import userReducer from "./slices/userSlice";
import adminReducer from "./slices/adminSlice";
import cartReducer from './slices/cartSlice'

const persistConfig = {
  key: "root",
  whitelist: ["user", "admin",'cart'],
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  admin: adminReducer,
  cart:cartReducer

});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { store, persistor };
