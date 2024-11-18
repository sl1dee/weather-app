export interface WeatherDetails {
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
}
