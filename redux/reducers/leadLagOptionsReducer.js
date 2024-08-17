import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    organism: null,
    sampleType: null,
};

const leadLagOptionsSlice = createSlice({
    name: 'leadLagOptions',
    initialState,
    reducers: {
        setOrganism: (state, action) => {
            state.organism = action.payload;
        },
        setSampleType: (state, action) => {
            state.sampleType = action.payload;
        }
    },
});

export const leadLagOptionsReducer = leadLagOptionsSlice.reducer;

export const actions = leadLagOptionsSlice.actions;

export const leadLagOptionsSelector = (state) => state.leadLagOptionsReducer;