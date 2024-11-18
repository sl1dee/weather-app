import { configureStore } from '@reduxjs/toolkit';
import { weatherAPI } from './features/weather/weatherAPI';
import weatherReducer from './features/weather/weatherSlice';

export const store = configureStore({
    reducer: {
        [weatherAPI.reducerPath]: weatherAPI.reducer,
        weather: weatherReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(weatherAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;