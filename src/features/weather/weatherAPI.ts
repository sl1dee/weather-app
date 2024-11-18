import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

export const weatherAPI = createApi({
    reducerPath: "weatherAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://api.weatherapi.com/v1",
    }),
    endpoints: (builder) => ({
        getWeather: builder.query({
            query: (city) => ({
                url: `/current.json`,
                params: {
                    key: WEATHER_API_KEY,
                    q: city,
                },
            }),
        }),
        searchCity: builder.query({
            query: (query) => ({
                url: `/search.json`,
                params: {
                    key: WEATHER_API_KEY,
                    q: query,
                },
            }),
        }),
    }),
});

export const { useLazyGetWeatherQuery, useLazySearchCityQuery } = weatherAPI;
