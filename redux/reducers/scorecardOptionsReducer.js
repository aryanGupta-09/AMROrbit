import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    antibiotic: null,
    organism: null,
    sampleType: null,
    country: null,
};

const scorecardOptionsSlice = createSlice({
    name: 'options',
    initialState,
    reducers: {
        setAntibiotic: (state, action) => {
            state.antibiotic = action.payload;
        },
        setOrganism: (state, action) => {
            state.organism = action.payload;
        },
        setSampleType: (state, action) => {
            state.sampleType = action.payload;
        },
        setCountry: (state, action) => {
            state.country = action.payload;
        },
    },
});

export const scorecardOptionsReducer = scorecardOptionsSlice.reducer;

export const actions = scorecardOptionsSlice.actions;

export const scorecardOptionsSelector = (state) => state.scorecardOptionsReducer;