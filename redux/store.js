import { configureStore } from "@reduxjs/toolkit";
import { optionsReducer } from "./reducers/optionsReducer";

export const store = configureStore({
    reducer: {
        optionsReducer,
    },
});