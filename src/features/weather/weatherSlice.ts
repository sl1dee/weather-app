import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WeatherDetails } from './types';

interface WeatherState {
    savedLocations: WeatherDetails[];
}

const initialState: WeatherState = {
    savedLocations: [],
};

const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {
        addLocation: (state, action: PayloadAction<WeatherDetails>) => {
            if (!state.savedLocations.some((loc) => loc.location.name === action.payload.location.name)) {
                state.savedLocations.push(action.payload);
            }
        },
        removeLocation: (state, action: PayloadAction<string>) => {
            state.savedLocations = state.savedLocations.filter(
                (loc) => loc.location.name !== action.payload
            );
        },
    },
});

export const { addLocation, removeLocation } = weatherSlice.actions;
export default weatherSlice.reducer;
