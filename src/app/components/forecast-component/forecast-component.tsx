import dayjs from "dayjs";
import styled from "styled-components";

import { ForecastData } from "../../data/interfaces";
import { formatTemperature, getWindDirection } from "../../helpers";

const FULL_DAY_FORMAT = "YYYY-MM-DD HH:mm";
const NOON_TIME = "12:00:00";

interface ForecastComponentProps {
  forecastData: ForecastData;
  isMetricUnits: boolean;
}

function ForecastComponent(props: ForecastComponentProps): JSX.Element {
  const {
    forecastData: { list },
    isMetricUnits,
  } = props;

  // #region Styling

  const ForecastWeatherSection = styled.div`
    display: flex;
    margin: 2rem;
    flex-direction: column;
    width: 80vw;
    border-radius: 16px;
    backdrop-filter: blur(20px);
    background-color: rgba(255, 255, 255, 0.25);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
    border: 1px solid #000000;
    color: #ffffff;
    & details {
      margin: 1rem 0;
    }
  `;

  const TableContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: top;
    width: 100%;
  `;

  const Table = styled.table`
    margin: 2rem;
    width: 100%;
    & > tbody {
      width: 100%;
    }
  `;

  const WeatherIcon = styled.img`
    max-width: 100px;
    max-height: 100px;
  `;

  // #endregion Styling

  // #region Aux methods

  function formatPop(pop: number): string {
    const percentage = new Intl.NumberFormat("default", {
      style: "percent",
      maximumFractionDigits: 2,
    }).format(pop);
    return `${percentage} of rain`;
  }

  // #endregion Aux methods

  return (
    <>
      <h2>5 day forecast</h2>
      <ForecastWeatherSection>
        <TableContainer>
          {list.map(
            (date) =>
              date.dt_txt.toString().includes(NOON_TIME) && (
                <Table key={date.dt}>
                  <thead>
                    <tr>
                      <th title={dayjs(date.dt_txt).format(FULL_DAY_FORMAT)}>
                        {dayjs(date.dt_txt).format("ddd DD")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <WeatherIcon
                          src={`https://openweathermap.org/img/wn/${date.weather[0].icon}@2x.png`}
                          title={date.weather[0].description}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td
                        title={`Feels like ${formatTemperature(
                          date.main.feels_like,
                          isMetricUnits
                        )}`}
                      >
                        <strong>
                          {formatTemperature(date.main.temp, isMetricUnits)}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {formatTemperature(date.main.temp_min, isMetricUnits)}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {date.weather[0].description}{" "}
                        {date.clouds.all ? `(${date.clouds.all}%)` : ""}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              )
          )}
        </TableContainer>
        <details>
          <summary>More details</summary>
          <TableContainer>
            {list.map(
              (date) =>
                date.dt_txt.toString().includes(NOON_TIME) && (
                  <Table key={date.dt}>
                    <tbody>
                      <tr>
                        <td>{date.main.humidity}% Humidity</td>
                      </tr>
                      <tr>
                        <td>{date.visibility} m</td>
                      </tr>
                      <tr>
                        <td>{date.main.pressure} hPa</td>
                      </tr>
                      <tr>
                        <td>{date.main.grnd_level} hPa</td>
                      </tr>
                      <tr>
                        <td>{date.main.sea_level} hPa</td>
                      </tr>
                      {date.pop > 0 && (
                        <tr>
                          <td>{formatPop(date.pop)}</td>
                        </tr>
                      )}
                      {date.wind && (
                        <>
                          {date.wind.speed && date.wind.deg && (
                            <tr>
                              <td>
                                {date.wind.speed}
                                {isMetricUnits ? " m/s" : " mph"}{" "}
                                {getWindDirection(date.wind.deg)}
                                {date.wind.gust && (
                                  <>
                                    , Gust at {date.wind.gust}
                                    {isMetricUnits ? " m/s" : " mph"}
                                  </>
                                )}
                              </td>
                            </tr>
                          )}
                        </>
                      )}
                      {date.rain && (
                        <tr>
                          <td>{date.rain["3h"]} mm of rain for last 3 hours</td>
                        </tr>
                      )}
                      {date.snow && (
                        <tr>
                          <td>{date.snow["3h"]} mm of snow for last 3 hours</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                )
            )}
          </TableContainer>
        </details>
      </ForecastWeatherSection>
    </>
  );
}

export default ForecastComponent;
