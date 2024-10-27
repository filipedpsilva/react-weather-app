import dayjs from "dayjs";
import styled from "styled-components";

import { WeatherData } from "../../data/interfaces";
import { formatTemperature, getWindDirection } from "../../helpers";

const HOUR_FORMAT = "HH:mm";

interface CurrentWeatherComponentProps {
  imgUrl: string;
  isMetricUnits: boolean;
  weatherData: WeatherData;
}

function CurrentWeatherComponent(
  props: CurrentWeatherComponentProps
): JSX.Element {
  const { imgUrl, isMetricUnits, weatherData } = props;
  const {
    clouds,
    coord,
    dt,
    id,
    main: {
      feels_like,
      humidity,
      pressure,
      temp,
      temp_max,
      temp_min,
    },
    name,
    sys: { country, sunrise, sunset },
    timezone,
    visibility,
    weather,
    wind,
    rain,
    snow,
  } = weatherData;

  const suntime = `Sunlight: ${dayjs
    .unix(sunrise)
    .format(HOUR_FORMAT)} - ${dayjs.unix(sunset).format(HOUR_FORMAT)}`;

  // #region Styling

  const CurrentWeatherSection = styled.div`
    position: relative;
    display: flex;
    margin: 2rem;
    flex-direction: column;
    min-height: 20vh;
    width: 80vw;
    border-radius: 16px;
    backdrop-filter: blur(20px);
    background-color: #777777;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
    border: 1px solid #000000;
    color: #ffffff;
    background-image: linear-gradient(
        rgba(15, 15, 15, 0.9),
        rgba(15, 15, 15, 0.4)
      ),
      url(${imgUrl});
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  `;

  const WeatherIcon = styled.img`
    max-width: 100px;
    max-height: 100px;
  `;

  const MainInfo = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    padding: 1rem;
    text-transform: capitalize;
  `;

  const SecondaryInfo = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  `;

  const WeatherSection = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 -2rem -1rem;
    gap: 0.5rem;
  `;

  const FeelsLikeSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    & h2,
    p {
      justify-content: start;
      margin: 0;
    }
  `;

  const Country = styled.h1`
    margin: 0;
  `;

  const PopperLink = styled.a`
    color: #ffffff;
    font-weight: 900;
    &:hover {
      color: #ffffff;
    }
  `;

  // #endregion Styling

  // #region Aux methods

  function mapTimezoneToUTC(timezone: number): string {
    if (!timezone) return "UTC";

    const oneHourInSeconds = 3600;
    const gmtTimezone = timezone / oneHourInSeconds;

    if (timezone > 0) return `UTC+${gmtTimezone}`;
    else return `UTC${gmtTimezone}`;
  }

  // #endregion Aux methods

  return (
    <>
      <h2>Current weather</h2>
      <h3>
        {dayjs.unix(dt as number).format(HOUR_FORMAT)} (
        {mapTimezoneToUTC(timezone as number)})
      </h3>
      <CurrentWeatherSection>
        <div>
          <MainInfo key={id}>
            <div>
              <Country
                title={`${coord.lat}, ${coord.lon}`}
              >{`${name}, ${country}`}</Country>
              {suntime} ({mapTimezoneToUTC(timezone)})
            </div>
            <div>
              <WeatherSection>
                <WeatherIcon
                  src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
                  title={weather[0].description}
                />
                <h1
                  title={`Min: ${formatTemperature(
                    temp_min,
                    isMetricUnits
                  )} | Max: ${formatTemperature(temp_max, isMetricUnits)}`}
                >
                  {formatTemperature(temp, isMetricUnits)}
                </h1>
                <FeelsLikeSection>
                  <h2 title={(clouds.all && `${clouds.all}%`) as string}>
                    {weather[0].main}
                  </h2>
                  <p>
                    Feels like{" "}
                    <strong>
                      {formatTemperature(feels_like, isMetricUnits)}
                    </strong>
                  </p>
                </FeelsLikeSection>
              </WeatherSection>
              <span>{weather[0].description}</span>
            </div>
          </MainInfo>
          <SecondaryInfo>
            {wind && (
              <div>
                <PopperLink
                  href="#"
                  title={
                    `${wind.speed} ${
                      isMetricUnits ? "m/s" : "mph"
                    } ${getWindDirection(wind.deg)}` +
                    (wind.gust
                      ? ` Gust at ${wind.gust} ${isMetricUnits ? "m/s" : "mph"}`
                      : "")
                  }
                >
                  Wind
                </PopperLink>
                <p>{`${wind.speed} ${
                  isMetricUnits ? "m/s" : "mph"
                } ${getWindDirection(wind.deg)}`}</p>
                {wind.gust && (
                  <p>{`Gust at ${wind.gust} ${
                    isMetricUnits ? "m/s" : "mph"
                  }`}</p>
                )}
              </div>
            )}
            {rain?.["1h"] && (
              <div>
                <PopperLink
                  href="#"
                  title={`${rain["1h"]} mm/h in the last 1h`}
                >
                  Rain
                </PopperLink>
                <p>{`${rain["1h"]} mm/h in the last 1h`}</p>
              </div>
            )}

            {snow?.["1h"] && (
              <div>
                <PopperLink
                  href="#"
                  title={`${snow["1h"]} mm/h in the last 1h`}
                >
                  Snow
                </PopperLink>
                <p>{`${snow["1h"]} mm/h in the last 1h`}</p>
              </div>
            )}
            {humidity && (
              <div>
                <PopperLink href="#" title={`${humidity}%`}>
                  Humidity
                </PopperLink>
                <p>{`${humidity}%`}</p>
              </div>
            )}
            {pressure && (
              <div>
                <PopperLink href="#" title={`${pressure} hPa`}>
                  Pressure
                </PopperLink>
                <p>{`${pressure} hPa`}</p>
              </div>
            )}
            {visibility && (
              <div>
                <PopperLink href="#" title={`${visibility} m`}>
                  Visibility
                </PopperLink>
                <p>{`${visibility} m`}</p>
              </div>
            )}
          </SecondaryInfo>
        </div>
      </CurrentWeatherSection>
    </>
  );
}

export default CurrentWeatherComponent;
