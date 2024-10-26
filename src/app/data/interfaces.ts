export interface ApiResponse<T> {
    data: T;
    status: number;
    statusText: string;
}

export interface WeatherData {
    coord: Coord;
    weather: Weather[];
    base: string;
    main: WeatherMain;
    visibility: number;
    wind: Wind;
    rain?: WeatherVolume;
    snow?: WeatherVolume;
    clouds: Clouds;
    dt: number;
    sys: WeatherSys;
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

export interface Coord {
    lat: number;
    lon: number;
}

export interface Weather {
    id: number;
    main: MainEnum;
    description: string;
    icon: string;
}

export enum MainEnum {
    // according to https://openweathermap.org/weather-conditions
    Thunderstorm = "Thunderstorm",
    Drizzle = "Drizzle",
    Rain = "Rain",
    Snow = "Snow",
    Mist = "Mist",
    Smoke = "Smoke",
    Haze = "Haze",
    Dust = "Dust",
    Fog = "Fog",
    Sand = "Sand",
    Ash = "Ash",
    Squall = "Squall",
    Tornado = "Tornado",
    Clear = "Clear",
    Clouds = "Clouds",
}

export interface WeatherMain {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
}

export interface Wind {
    speed: number;
    deg: number;
    gust?: number;
}

export interface WeatherVolume {
    "1h"?: number;
    "3h"?: number;
}

export interface Clouds {
    all: number;
}

export interface WeatherSys {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
}


export interface ForecastData {
    cod: string;
    message: number;
    cnt: number;
    list: List[];
    city: City;
}

export interface City {
    id: number;
    name: string;
    coord: Coord;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
}

export interface List {
    dt: number;
    main: MainClass;
    weather: Weather[];
    clouds: Clouds;
    wind: Wind;
    visibility: number;
    pop: number;
    sys: ForecastSys;
    dt_txt: Date;
    rain?: WeatherVolume;
    snow?: WeatherVolume;
}

export interface MainClass {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
}

export interface ForecastSys {
    pod: Pod;
}

export enum Pod {
    D = "d",
    N = "n",
}