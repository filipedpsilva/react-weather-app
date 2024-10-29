import { useEffect, useState } from "react";

import axios from "axios";
import { object, string } from "yup";
import styled from "styled-components";
import { createApi } from "unsplash-js";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { CurrentWeatherComponent, ForecastComponent } from "src/app/components";
import {
  DEVICE_SIZES,
  BASE_API_URL,
  API_KEY,
  ACCESS_KEY,
} from "src/app/data/constants";
import { WeatherData, ForecastData } from "src/app/data/interfaces";
import { getTemperatureUnit } from "src/app/helpers/helpers";

// #region Styling

const SearchBar = styled.div<{ $isMetricUnits: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 4rem;
  margin: 0rem 1rem 4rem 0rem;

  @media only screen and (min-width: ${DEVICE_SIZES.mobileS}) and (max-width: ${DEVICE_SIZES.tablet}) {
    max-width: 90vw;
    gap: 1rem;
    flex-direction: column;
    align-items: center;
    margin: 0 0 1rem 0;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(142, 65, 230, 0.75);
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "${(props) => getTemperatureUnit(props.$isMetricUnits)}";
    height: 26px;
    width: 26px;
    left: 30px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    color: rgba(41, 118, 162, 0.75);
  }

  input:checked + .slider {
    background-color: rgba(63, 157, 211, 0.75);
    color: rgba(41, 118, 162, 0.75);
  }

  input:focus + .slider {
    box-shadow: 0 0 10px #ffffff;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(-26px);
    -ms-transform: translateX(-26px);
    transform: translateX(-26px);
  }

  .slider.round {
    border-radius: 34px;

    &:before {
      border-radius: 50%;
    }
  }
`;

const Input = styled(Field)`
  display: flex;
  position: relative;
  min-height: 44px;
  border: 1px solid transparent;
  background: #4d5156;
  box-shadow: none;
  border-radius: 24px;
  margin: 0 auto;
  width: 638px;
  max-width: 584px;
  padding: 0 20px;
  font-size: xx-large;

  @media only screen and (min-width: ${DEVICE_SIZES.mobileS}) and (max-width: ${DEVICE_SIZES.tablet}) {
    max-width: 80vw;
    font-size: x-large;
  }
`;

const Loading = styled.div`
  background-color: rgb(104, 93, 255);
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  animation: fadeInAnimation ease 1s;
  animation-iteration-count: 1;

  @keyframes fadeInAnimation {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
`;

// #endregion Styling

interface IWeatherState {
  errorMessage: string;
  location: string;
  locationImgUrl: string;
  currentWeatherData?: WeatherData;
  forecastData?: ForecastData;
}

function WeatherPage(): JSX.Element {
  const initialWeatherState: IWeatherState = {
    errorMessage: "",
    location: "",
    locationImgUrl: "",
    currentWeatherData: undefined,
    forecastData: undefined,
  };
  const [weatherState, setWeatherState] =
    useState<IWeatherState>(initialWeatherState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMetricUnits, setIsMetricUnits] = useState<boolean>(true);

  const userSchema = object({
    location: string().required().nonNullable(),
  });

  useEffect(() => {
    if (weatherState.location) {
      getData();
    }
  }, [isMetricUnits, weatherState.location]);

  function getUnits(): string {
    return isMetricUnits ? "metric" : "imperial";
  }

  function getData(): void {
    setIsLoading(true);

    axios
      .get(
        `${BASE_API_URL}/2.5/weather?q=${
          weatherState.location
        }&units=${getUnits()}&APPID=${API_KEY}`
      )
      .then(async (weatherResult) => {
        const forecastResult = await axios.get(
          `${BASE_API_URL}/2.5/forecast?q=${
            weatherState.location
          }&units=${getUnits()}&APPID=${API_KEY}`
        );

        const api = createApi({
          accessKey: ACCESS_KEY,
        });

        const coverResult = await api.search.getPhotos({
          query: weatherState.location,
          page: 1,
          perPage: 1,
          orderBy: "editorial",
        });

        return {
          weatherResult,
          forecastResult,
          coverResult,
        };
      })
      .then((response) => {
        setWeatherState({
          ...weatherState,
          errorMessage: "",
          currentWeatherData: response.weatherResult.data,
          forecastData: response.forecastResult.data,
          locationImgUrl: response.coverResult.response?.results[0].urls
            .regular as string,
        });
      })
      .catch((err) => {
        setWeatherState({
          ...weatherState,
          errorMessage: err.response.data.message,
          currentWeatherData: initialWeatherState.currentWeatherData,
          forecastData: initialWeatherState.forecastData,
          locationImgUrl: initialWeatherState.locationImgUrl,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      {isLoading && <Loading />}

      <SearchBar $isMetricUnits={isMetricUnits}>
        <Formik
          initialValues={{ location: weatherState.location }}
          validationSchema={() => userSchema}
          onSubmit={(values) => {
            setWeatherState({ ...weatherState, location: values.location });
          }}
        >
          {() => (
            <>
              <Form>
                <Input
                  disabled={isLoading}
                  id="location-field"
                  type="search"
                  name="location"
                  placeholder="Search for location"
                />
                <ErrorMessage name="location" component="div" />
              </Form>
            </>
          )}
        </Formik>

        {weatherState.currentWeatherData && weatherState.forecastData && (
          <div className="switch">
            <input
              type="checkbox"
              checked={isMetricUnits}
              onChange={(e) => {
                setIsMetricUnits(e.target.checked);
              }}
            />
            <div
              className="slider round"
              onClick={() => {
                setIsMetricUnits(!isMetricUnits);
              }}
            ></div>
          </div>
        )}
      </SearchBar>

      {weatherState.errorMessage && <h1>{weatherState.errorMessage}</h1>}

      {weatherState.currentWeatherData && (
        <CurrentWeatherComponent
          weatherData={weatherState.currentWeatherData}
          imgUrl={weatherState.locationImgUrl}
          isMetricUnits={isMetricUnits}
        />
      )}

      {weatherState.forecastData && weatherState.forecastData.list && (
        <ForecastComponent
          forecastData={weatherState.forecastData}
          isMetricUnits={isMetricUnits}
        />
      )}
    </>
  );
}

export default WeatherPage;
