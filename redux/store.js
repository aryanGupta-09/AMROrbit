import { configureStore } from "@reduxjs/toolkit";
import { scorecardOptionsReducer } from "./reducers/scorecardOptionsReducer";
import { leadLagOptionsReducer } from "./reducers/leadLagOptionsReducer";

export const store = configureStore({
    reducer: {
        scorecardOptionsReducer,
        leadLagOptionsReducer,
    },
});