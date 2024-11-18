import React, {useState} from "react";
import cl from './index.module.scss'
import {Link} from "react-router-dom";

type WeatherCardProps = {
    weather: {
        location: {
            name: string;
        };
        current: {
            temp_c: number;
            condition: {
                text: string;
                icon: string;
            };
            wind_kph: number;
            humidity: number;
        }
    };
    onRemove: (city: string) => void;
    onDetails: () => void;
};

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, onRemove, onDetails }) => {

    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const isMobile = window.innerWidth < 993;

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart && touchEnd && touchEnd - touchStart > 150) {
            setTimeout(() => onRemove(weather.location.name), 300);
        }
        setTouchStart(null);
        setTouchEnd(null);
    };

    return (
        <div
            className={cl.wrapper}
            onTouchStart={isMobile ? handleTouchStart : undefined}
            onTouchMove={isMobile ? handleTouchMove : undefined}
            onTouchEnd={isMobile ? handleTouchEnd : undefined}
        >
            <h2 className={cl.name}>{weather.location.name}</h2>
            <div className={cl.info}>
                <div className={cl.indicators}>
                    <p>Humidity: {weather.current.humidity}%</p>
                    <p>Temperature: {weather.current.temp_c}°C</p>
                    <p>Wind Speed: {weather.current.wind_kph} km/h</p>
                </div>
                <div className={cl.condition}>
                    <div className={cl.text}>{weather.current.condition.text}</div>
                    <img className={cl.image} src={weather.current.condition.icon} alt={weather.current.condition.text} />
                </div>
            </div>
            <div className={cl.buttons}>
                <Link to={`/details/${weather.location.name}`}>
                    <button className={cl.details} onClick={onDetails}>
                        Details
                    </button>
                </Link>
                <button className={cl.remove} onClick={() => onRemove(weather.location.name)}>
                    Remove
                </button>
            </div>
        </div>
    );
};

export default WeatherCard;
