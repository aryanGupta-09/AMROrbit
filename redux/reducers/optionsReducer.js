import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    antibiotic: null,
    organism: null,
    sampleType: null,
    country: null,
};

const optionsSlice = createSlice({
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

export const optionsReducer = optionsSlice.reducer;

export const actions = optionsSlice.actions;

export const optionsSelector = (state) => state.optionsReducer;