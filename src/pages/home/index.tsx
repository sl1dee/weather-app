import React, { useState, useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";
import {useLazyGetWeatherQuery, useLazySearchCityQuery} from "../../features/weather/weatherAPI";
import SearchBar from "../../components/search-bar";
import WeatherCard from "../../components/weather-card";
// @ts-ignore
import cl from './index.module.scss'

const Home = () => {
    const [weatherList, setWeatherList] = useState<any[]>([]);
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 500);

    const [triggerWeatherQuery] = useLazyGetWeatherQuery();
    const [triggerCitySearchQuery, { data: searchResults }] = useLazySearchCityQuery();

    useEffect(() => {
        const savedWeatherList = JSON.parse(localStorage.getItem("weatherList") || "[]");
        setWeatherList(savedWeatherList);
    }, []);

    useEffect(() => {
        localStorage.setItem("weatherList", JSON.stringify(weatherList));
    }, [weatherList]);

    console.log(localStorage)

    // загружаем 6 городов по умолчанию
    useEffect(() => {
        const fetchRandomCities = async () => {
            const cities = ["New York", "London", "Paris", "Tokyo", "Berlin", "Sydney"];
            try {
                const weatherData = await Promise.all(
                    cities.map((city) => triggerWeatherQuery(city).unwrap())
                );
                setWeatherList(weatherData);
            } catch (error) {
                console.error("Ошибка при получении данных о погоде:", error);
            }
        };

        fetchRandomCities();
    }, [triggerWeatherQuery]);

    // запрос при вводе названия > 2 символов
    useEffect(() => {
        if (debouncedQuery.trim().length > 2) {
            triggerCitySearchQuery(debouncedQuery);
        }
    }, [debouncedQuery, triggerCitySearchQuery]);

    // при повторном поиске города (обращаемся в кэш)
    const handleCitySelect = async (city: string) => {
        // Проверяем, есть ли город уже в weatherList
        const cityAlreadyAdded = weatherList.some(
            (weather) => weather.location.name.toLowerCase() === city.toLowerCase()
        );
        if (cityAlreadyAdded) {
            return;
        }

        // Проверяем, есть ли город в локальном кеше
        const cachedWeather = JSON.parse(localStorage.getItem(`weather-${city}`) || "null");
        if (cachedWeather) {
            setWeatherList((prev) => [cachedWeather, ...prev]);
            return;
        }

        // выполняем запрос к апи если города нет ни в кэше, ни в weatherList
        try {
            const result = await triggerWeatherQuery(city).unwrap();
            localStorage.setItem(`weather-${city}`, JSON.stringify(result));
            setWeatherList((prev) => [result, ...prev]);
        } catch (error) {
            console.error("Ошибка при добавлении города:", error);
        }
    };

    const handleCitySelectForDetails = (weather: any) => {
        localStorage.setItem("selectedCityWeather", JSON.stringify(weather));
    };


    const handleRemoveCity = (city: string) => {
        setWeatherList((prev) => prev.filter((item) => item.location.name !== city));
    };

    return (
        <div className={cl.wrapper}>
            <div className={cl.header}>
                <h1>Simple Weather App</h1>
                <SearchBar
                    onSelect={handleCitySelect}
                    searchResults={searchResults}
                    onSearch={(query) => setQuery(query)}
                />
            </div>
            {weatherList.length > 0 && (
                <div className={cl.cities}>
                    <h2 className={cl.title}>Cities</h2>
                    <div className={cl.cards}>
                        {weatherList.map((weather) => (
                            <WeatherCard
                                key={weather.location}
                                weather={{
                                    location: weather.location,
                                    current: weather.current
                                }}
                                onRemove={handleRemoveCity}
                                onDetails={() => handleCitySelectForDetails(weather)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
