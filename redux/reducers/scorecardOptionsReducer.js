import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  antibiotic: "Amikacin",
  organism: "Klebsiella pneumoniae",
  sampleType: "Blood",
  country: "All",
};

const scorecardOptionsSlice = createSlice({
  name: "options",
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

export const scorecardOptionsSelector = (state) =>
  state.scorecardOptionsReducer;
