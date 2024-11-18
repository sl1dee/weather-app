import React, { useState, useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";
import {useLazyGetWeatherQuery, useLazySearchCityQuery} from "../../features/weather/weatherAPI";
import SearchBar from "../../components/search-bar";
import WeatherCard from "../../components/weather-card";
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
        const fetchWeatherData = async () => {
            const savedWeatherList = JSON.parse(localStorage.getItem("weatherList") || "[]");

            const allCities = Object.keys(localStorage)
                .filter(key => key.startsWith("weather-"))
                .map(key => JSON.parse(localStorage.getItem(key)!));

            const updatedWeatherList = [...savedWeatherList, ...allCities];

            const uniqueWeatherList = updatedWeatherList.filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t.location.name.toLowerCase() === value.location.name.toLowerCase()
                    ))
            );

            setWeatherList(uniqueWeatherList);
        };

        fetchWeatherData();
    }, []);

    // запрос при вводе названия > 2 символов
    useEffect(() => {
        if (debouncedQuery.trim().length > 2) {
            triggerCitySearchQuery(debouncedQuery);
        }
    }, [debouncedQuery, triggerCitySearchQuery]);

    // при повторном поиске города (обращаемся в кэш)
    const handleCitySelect = async (city: string) => {
        // проверяем наличие города в weatherList
        const cityAlreadyAdded = weatherList.some(
            (weather) => weather.location.name.toLowerCase() === city.toLowerCase()
        );
        if (cityAlreadyAdded) {
            return;
        }

        // выполняем запрос к апи если в weatherList нет города
        try {
            const result = await triggerWeatherQuery(city).unwrap();

            // Сохраняем этот город по ключу `weather-${city}`
            localStorage.setItem(`weather-${city}`, JSON.stringify(result));

            // Обновляем weatherList и сохраняем его в localStorage
            const updatedList = [result, ...weatherList];
            setWeatherList(updatedList);
            localStorage.setItem("weatherList", JSON.stringify(updatedList));
        } catch (error) {
            console.error("Ошибка при добавлении города:", error);
        }
    };

    const handleCitySelectForDetails = (weather: any) => {
        localStorage.setItem("selectedCityWeather", JSON.stringify(weather));
    };

    const handleRemoveCity = (city: string) => {
        localStorage.removeItem(`weather-${city}`);

        const updatedList = weatherList.filter((item) => item.location.name !== city);
        setWeatherList(updatedList);

        localStorage.setItem("weatherList", JSON.stringify(updatedList));
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
            {weatherList.length > 0 ? (
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
            ) : (
                <h2>Add cities</h2>
            )}
        </div>
    );
};

export default Home;
