import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// import { propertySlice } from './slices/propertySlice'; // Example slice
// import { walletSlice } from './slices/walletSlice';
// import { apiSlice } from './slices/apiSlice';

export const store = configureStore({
  reducer: {
    // [apiSlice.reducerPath]: apiSlice.reducer,
    // property: propertySlice.reducer,
    // wallet: walletSlice.reducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
