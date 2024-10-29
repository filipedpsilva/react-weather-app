import dayjs from "dayjs";
import styled from "styled-components";

import { DEVICE_SIZES, HOUR_FORMAT } from "src/app/data/constants";
import { WeatherData } from "src/app/data/interfaces";
import {
  formatTemperature,
  getWindDirection,
  formatVisibility,
  getSpeedUnit,
} from "src/app/helpers/helpers";

// #region Styling

const CurrentWeatherSection = styled.div<{ $imgUrl: string }>`
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
    url(${(props) => props.$imgUrl});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  @media only screen and (min-width: ${DEVICE_SIZES.mobileS}) and (max-width: ${DEVICE_SIZES.tablet}) {
    width: 90vw;
    max-width: 90vw;
    flex-direction: column;
  }
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

  @media only screen and (min-width: ${DEVICE_SIZES.mobileS}) and (max-width: ${DEVICE_SIZES.laptop}) {
    max-width: 90vw;
    flex-direction: column;
  }
`;

const SecondaryInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;

  @media only screen and (min-width: ${DEVICE_SIZES.mobileS}) and (max-width: ${DEVICE_SIZES.laptop}) {
    max-width: 90vw;
    flex-direction: column;
  }
`;

const WeatherSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 -2rem -1rem;
  gap: 0.5rem;

  @media only screen and (min-width: ${DEVICE_SIZES.mobileS}) and (max-width: ${DEVICE_SIZES.laptop}) {
    max-width: 90vw;
    flex-direction: column;
    justify-content: center;
    margin: 1rem 0;

    & h1 {
      margin: 0rem;
    }
  }
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

  @media only screen and (min-width: ${DEVICE_SIZES.mobileS}) and (max-width: ${DEVICE_SIZES.laptop}) {
    max-width: 90vw;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const Country = styled.h1`
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 80vw;
`;

const Title = styled.p`
  color: #ffffff;
  font-weight: 900;

  &:hover {
    color: #ffffff;
  }
`;

// #endregion Styling

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
    main: { feels_like, humidity, pressure, temp, temp_max, temp_min },
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

  // #region Aux methods

  function mapTimezoneToUTC(timezone: number): string {
    if (!timezone) return "UTC";

    const oneHourInSeconds = 3600;
    const gmtTimezone = timezone / oneHourInSeconds;

    if (timezone > 0) return `UTC+${gmtTimezone}`;
    else return `UTC${gmtTimezone}`;
  }

  // #endregion Aux methods

  const minAndMaxTemp = `Min: ${formatTemperature(
    temp_min,
    isMetricUnits
  )} | Max: ${formatTemperature(temp_max, isMetricUnits)}`;

  const windTitle =
    `${wind.speed} ${getSpeedUnit(isMetricUnits)} ${getWindDirection(
      wind.deg
    )},` +
    (wind.gust ? ` Gust at ${wind.gust} ${getSpeedUnit(isMetricUnits)}` : "");

  return (
    <>
      <h2>Current weather</h2>
      <h3>
        {dayjs.unix(dt as number).format(HOUR_FORMAT)} (
        {mapTimezoneToUTC(timezone as number)})
      </h3>
      <CurrentWeatherSection $imgUrl={imgUrl}>
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
                <h1 title={minAndMaxTemp}>
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
                <Title title={windTitle}>Wind</Title>
                <p>{`${wind.speed} ${getSpeedUnit(
                  isMetricUnits
                )} ${getWindDirection(wind.deg)}`}</p>
                {wind.gust && (
                  <p>{`Gust at ${wind.gust} ${getSpeedUnit(isMetricUnits)}`}</p>
                )}
              </div>
            )}
            {humidity && (
              <div>
                <Title title={`${humidity}%`}>Humidity</Title>
                <p>{`${humidity}%`}</p>
              </div>
            )}
            {visibility && (
              <div>
                <Title title={formatVisibility(visibility)}>Visibility</Title>
                <p>{formatVisibility(visibility)}</p>
              </div>
            )}
            {pressure && (
              <div>
                <Title title={`${pressure} hPa`}>Pressure</Title>
                <p>{`${pressure} hPa`}</p>
              </div>
            )}

            {rain?.["1h"] && (
              <div>
                <Title title={`${rain["1h"]} mm/h in the last 1h`}>Rain</Title>
                <p>{`${rain["1h"]} mm/h `}</p>
                <p>in the last 1h</p>
              </div>
            )}

            {snow?.["1h"] && (
              <div>
                <Title title={`${snow["1h"]} mm/h in the last 1h`}>Snow</Title>
                <p>{`${snow["1h"]} mm/h`}</p>
                <p>in the last 1h</p>
              </div>
            )}
          </SecondaryInfo>
        </div>
      </CurrentWeatherSection>
    </>
  );
}

export default CurrentWeatherComponent;
