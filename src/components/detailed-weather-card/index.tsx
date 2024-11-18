import React, {useMemo} from "react";
// @ts-ignore
import cl from './index.module.scss'
import {Link} from "react-router-dom";

type DetailedWeatherCardProps = {
    weather: {
        location: {
            name: string;
            region: string;
            country: string;
        };
        current: {
            temp_c: number;
            feelslike_c: number;
            condition: {
                text: string;
                icon: string;
            };
            wind_kph: number;
            humidity: number;
            cloud: number;
            precip_mm: number;
            uv: number
        }
    };
};



const DetailedWeatherCard: React.FC<DetailedWeatherCardProps> = ({ weather }) => {

    const widgetList = useMemo(
        () => [
            {
                id: 0,
                title: 'Temperature',
                value: weather.current.temp_c,
                measurement: '°C',
            },
            {
                id: 1,
                title: 'Feels like',
                value: weather.current.feelslike_c,
                measurement: '°C',
            },
            {
                id: 2,
                title: 'Condition',
                value: weather.current.condition.text,
                image: weather.current.condition.icon,
            },
            {
                id: 3,
                title: 'Wind Speed',
                value: weather.current.wind_kph,
                measurement: ' km/h',
            },
            {
                id: 4,
                title: 'Humidity',
                value: weather.current.humidity,
                measurement: ' %',
            },
            {
                id: 5,
                title: 'Cloudy',
                value: weather.current.cloud,
                measurement: ' %',
            },
            {
                id: 6,
                title: 'Precipitation',
                value: weather.current.precip_mm,
                measurement: ' mm',
            },
            {
                id: 7,
                title: 'UV radiation',
                value: weather.current.uv,
            },

        ],
        []
    )

    return (
        <div className={cl.wrapper}>
            <div className={cl.headLine}>
                <h2 className={cl.name}>{weather.location.name}</h2>
                <div className={cl.region}>{weather.location.region}, {weather.location.country}</div>
                <div className={cl.weather}>{weather.current.temp_c}°C | {weather.current.condition.text}
                    <img src={weather.current.condition.icon} alt={weather.current.condition.text} />
                </div>
                <Link to={'/'}><button className={cl.back}>Back</button></Link>
            </div>
            <div className={cl.cards}>
                {widgetList.map(({ id, title, image, value, measurement }) => (
                    <div className={cl.card} key={id}>
                        <h2 className={cl.title}>{title}</h2>
                        <p className={cl.value}>{value}{measurement && measurement}</p>
                        {image && (<img className={cl.image} src={image} alt={value}/>)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DetailedWeatherCard;
