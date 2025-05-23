import { configureStore } from "@reduxjs/toolkit";
import reducer from "./rootReducer";
import baseApi from "./api/baseAPI";

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
