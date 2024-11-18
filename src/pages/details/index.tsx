import React, {useEffect, useState} from 'react';
import DetailedWeatherCard from "../../components/detailed-weather-card";
import {useParams} from "react-router-dom";

const Details = () => {
    const { id } = useParams<{ id: string }>();
    const [weatherDetails, setWeatherDetails] = useState<any>(null);

    useEffect(() => {
        const savedWeather = JSON.parse(localStorage.getItem("selectedCityWeather") || "null");
        if (savedWeather && savedWeather.location.name === id) {
            setWeatherDetails(savedWeather);
        }
    }, [id]);

    console.log(weatherDetails)

    if (!weatherDetails) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <DetailedWeatherCard
                weather={{
                    location: weatherDetails.location,
                    current: weatherDetails.current,
                }}
            />
        </div>
    );
};

export default Details;