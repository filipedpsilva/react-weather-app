import { useEffect, useState } from "react";

import axios from "axios";
import styled from "styled-components";
import { createApi } from "unsplash-js";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { object, string } from "yup";

import { ACCESS_KEY, API_KEY, BASE_API_URL } from "../../data/constants";
import { ForecastData, WeatherData } from "../../data/interfaces";
import { CurrentWeatherComponent } from "../../components";

interface IWeatherState {
  errorMessage: string;
  location: string;
  locationImgUrl: string;
  currentWeatherData?: WeatherData;
  forecastData?: ForecastData;
}

interface WeatherPageProps {}

function WeatherPage(props: WeatherPageProps): JSX.Element {
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

  const SearchBar = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4rem;
    margin-bottom: 8rem;

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
      content: "ºF";
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }

    .slider:before {
      position: absolute;
      content: "${isMetricUnits ? "ºC" : "ºF"}";
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
      background-color: rgba(41, 118, 162, 0.75);
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
    }

    .slider.round:before {
      border-radius: 50%;
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

  function getData() {
    setIsLoading(true);

    axios
      .get(
        `${BASE_API_URL}/2.5/weather?q=${weatherState.location}&units=${
          isMetricUnits ? "metric" : "imperial"
        }&APPID=${API_KEY}`
      )
      .then(async (weatherResult) => {
        const forecastResult = await axios.get(
          `${BASE_API_URL}/2.5/forecast?q=${weatherState.location}&units=${
            isMetricUnits ? "metric" : "imperial"
          }&APPID=${API_KEY}`
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

      <SearchBar>
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
                  type="location"
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
    </>
  );
}

export default WeatherPage;
