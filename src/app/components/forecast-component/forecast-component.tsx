import { Fragment } from "react/jsx-runtime";

import dayjs from "dayjs";
import styled from "styled-components";
import { useWindowWidth } from "@react-hook/window-size";

import {
  DEVICE_SIZES,
  NOON_TIME,
  FULL_DAY_FORMAT,
} from "src/app/data/constants";
import { ForecastData } from "src/app/data/interfaces";
import {
  formatTemperature,
  getWindDirection,
  formatVisibility,
  getSpeedUnit,
} from "src/app/helpers/helpers";
import { GraphComponent } from "src/app/shared";

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

  @media only screen and (min-width: ${DEVICE_SIZES.mobileS}) and (max-width: ${DEVICE_SIZES.tablet}) {
    width: 90vw;
    max-width: 90vw;
    flex-direction: row;

    & details.mobile {
      display: block;
    }
  }
`;

const TableContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: flex-start;
  max-width: 100%;

  & hr {
    width: 80%;
    border: 1px solid #fff;

    &:last-child {
      display: none;
    }
  }

  @media only screen and (min-width: ${DEVICE_SIZES.mobileS}) and (max-width: ${DEVICE_SIZES.tablet}) {
    &.mobile {
      width: 90vw;
      max-width: 90vw;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      display: flex;
    }
  }
`;

const Table = styled.div`
  margin: 2rem;
  width: 8rem;
  max-width: 8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .capitalize {
    margin-top: 0.5rem;
    text-transform: capitalize;
  }

  @media only screen and (max-width: ${DEVICE_SIZES.laptop}) {
    margin: 2rem 0;
  }

  @media only screen and (max-width: ${DEVICE_SIZES.tablet}) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
`;

const TableRow = styled.div`
  flex-direction: row;
`;

const TableHeader = styled.h2`
  display: table-cell;
  vertical-align: inherit;
  font-weight: bold;
  text-align: -internal-center;
  unicode-bidi: isolate;
  padding: 1px;
`;

const WeatherIcon = styled.img`
  max-width: 100px;
  max-height: 100px;
`;

// #endregion Styling

interface ForecastComponentProps {
  forecastData: ForecastData;
  isMetricUnits: boolean;
}

function ForecastComponent(props: ForecastComponentProps): JSX.Element {
  const {
    forecastData: { list },
    isMetricUnits,
  } = props;
  const isMobile = useWindowWidth() <= 768;

  // #region Aux methods

  function formatPop(pop: number): string {
    return new Intl.NumberFormat("en", {
      style: "percent",
      maximumFractionDigits: 2,
    }).format(pop);
  }

  // #endregion Aux methods

  return (
    <>
      <h2>5 day forecast</h2>
      <ForecastWeatherSection>
        {isMobile ? (
          <TableContainer className="mobile">
            {list.map(
              (date, key) =>
                date.dt_txt.toString().includes(NOON_TIME) && (
                  <Fragment key={key}>
                    <Table>
                      <TableRow>
                        <TableHeader
                          title={dayjs(date.dt_txt).format(FULL_DAY_FORMAT)}
                        >
                          {dayjs(date.dt_txt).format("ddd DD")}
                        </TableHeader>
                      </TableRow>
                      <TableRow>{dayjs(date.dt_txt).format("HH:mm")}</TableRow>
                      <TableRow>
                        <WeatherIcon
                          src={`https://openweathermap.org/img/wn/${date.weather[0].icon}@2x.png`}
                          title={date.weather[0].description}
                        />
                      </TableRow>
                      <TableRow
                        title={`Feels like ${formatTemperature(
                          date.main.feels_like,
                          isMetricUnits
                        )}`}
                      >
                        <strong>
                          {formatTemperature(date.main.temp, isMetricUnits)}
                        </strong>
                      </TableRow>
                      <TableRow>
                        {formatTemperature(date.main.temp_min, isMetricUnits)}
                      </TableRow>
                      <TableRow>
                        {date.weather[0].description}{" "}
                        {date.clouds.all ? `(${date.clouds.all}%)` : ""}
                      </TableRow>
                    </Table>
                    <details className="mobile">
                      <summary>More details</summary>
                      <TableContainer className="mobile">
                        <Table>
                          {date.wind.speed && date.wind.deg && (
                            <>
                              <TableRow className="capitalize">
                                <strong>wind</strong>
                              </TableRow>
                              <TableRow>
                                {date.wind.speed} {getSpeedUnit(isMetricUnits)}{" "}
                                <strong>
                                  {getWindDirection(date.wind.deg)}
                                </strong>
                              </TableRow>
                            </>
                          )}

                          {date.wind.gust && (
                            <>
                              <TableRow className="capitalize">
                                <strong>wind gust</strong>
                              </TableRow>
                              <TableRow>
                                {date.wind.gust}
                                {getSpeedUnit(isMetricUnits)}
                              </TableRow>
                            </>
                          )}
                          <TableRow className="capitalize">
                            <strong>humidity</strong>
                          </TableRow>
                          <TableRow>{date.main.humidity}%</TableRow>
                          <TableRow className="capitalize">
                            <strong>visibility</strong>
                          </TableRow>
                          <TableRow>
                            {formatVisibility(date.visibility)}
                          </TableRow>
                          <TableRow className="capitalize">
                            <strong>pressure</strong>
                          </TableRow>
                          <TableRow>{date.main.pressure} hPa</TableRow>

                          {date.pop > 0 && (
                            <>
                              <TableRow className="capitalize">
                                <strong title="Probability of precipitation">
                                  Prob. of precipitation
                                </strong>
                              </TableRow>
                              <TableRow>{formatPop(date.pop)}</TableRow>
                            </>
                          )}

                          {date.rain && (
                            <>
                              <TableRow className="capitalize">
                                <strong>rain</strong>
                              </TableRow>
                              <TableRow>{date.rain["3h"]} mm</TableRow>
                              <TableRow>(last 3 hours)</TableRow>
                            </>
                          )}
                          {date.snow && (
                            <>
                              <TableRow className="capitalize">
                                <strong>snow</strong>
                              </TableRow>
                              <TableRow>{date.snow["3h"]} mm</TableRow>
                              <TableRow>(last 3 hours)</TableRow>
                            </>
                          )}
                        </Table>
                      </TableContainer>
                    </details>
                    <hr></hr>
                  </Fragment>
                )
            )}
            <details>
              <summary>Temperature Graph</summary>
              <>
                <p>(click on point to get more info)</p>
                <GraphComponent
                  data={list}
                  isMetricUnits={isMetricUnits}
                  isMobile={isMobile}
                />
              </>
            </details>
          </TableContainer>
        ) : (
          <>
            <TableContainer>
              {list.map(
                (date, key) =>
                  date.dt_txt.toString().includes(NOON_TIME) && (
                    <Table key={key}>
                      <TableRow>
                        <TableHeader
                          title={dayjs(date.dt_txt).format(FULL_DAY_FORMAT)}
                        >
                          {dayjs(date.dt_txt).format("ddd DD")}
                        </TableHeader>
                      </TableRow>
                      <TableRow>{dayjs(date.dt_txt).format("HH:mm")}</TableRow>
                      <TableRow>
                        <WeatherIcon
                          src={`https://openweathermap.org/img/wn/${date.weather[0].icon}@2x.png`}
                          title={date.weather[0].description}
                        />
                      </TableRow>
                      <TableRow
                        title={`Feels like ${formatTemperature(
                          date.main.feels_like,
                          isMetricUnits
                        )}`}
                      >
                        <strong>
                          {formatTemperature(date.main.temp, isMetricUnits)}
                        </strong>
                      </TableRow>
                      <TableRow>
                        {formatTemperature(date.main.temp_min, isMetricUnits)}
                      </TableRow>
                      <TableRow className="capitalize">
                        {date.weather[0].description}{" "}
                        {date.clouds.all && `Cloudiness at ${date.clouds.all}%`}
                      </TableRow>
                    </Table>
                  )
              )}
            </TableContainer>
            <details>
              <summary>More details</summary>
              <TableContainer>
                {list.map(
                  (date, key) =>
                    date.dt_txt.toString().includes(NOON_TIME) && (
                      <Table key={key}>
                        {date.wind.speed && date.wind.deg && (
                          <>
                            <TableRow className="capitalize">
                              <strong>wind</strong>
                            </TableRow>
                            <TableRow>
                              {date.wind.speed} {getSpeedUnit(isMetricUnits)}{" "}
                              <strong>{getWindDirection(date.wind.deg)}</strong>
                            </TableRow>
                          </>
                        )}

                        {date.wind.gust && (
                          <>
                            <TableRow className="capitalize">
                              <strong>wind gust</strong>
                            </TableRow>
                            <TableRow>
                              {date.wind.gust}
                              {getSpeedUnit(isMetricUnits)}
                            </TableRow>
                          </>
                        )}
                        <TableRow className="capitalize">
                          <strong>humidity</strong>
                        </TableRow>
                        <TableRow>{date.main.humidity}%</TableRow>
                        <TableRow className="capitalize">
                          <strong>visibility</strong>
                        </TableRow>
                        <TableRow>{formatVisibility(date.visibility)}</TableRow>
                        <TableRow className="capitalize">
                          <strong>pressure</strong>
                        </TableRow>
                        <TableRow>{date.main.pressure} hPa</TableRow>

                        {date.pop > 0 && (
                          <>
                            <TableRow className="capitalize">
                              <strong title="Probability of precipitation">
                                Prob. of precipitation
                              </strong>
                            </TableRow>
                            <TableRow>{formatPop(date.pop)}</TableRow>
                          </>
                        )}

                        {date.rain && (
                          <>
                            <TableRow className="capitalize">
                              <strong>rain</strong>
                            </TableRow>
                            <TableRow>{date.rain["3h"]} mm</TableRow>
                            <TableRow>(last 3 hours)</TableRow>
                          </>
                        )}
                        {date.snow && (
                          <>
                            <TableRow className="capitalize">
                              <strong>snow</strong>
                            </TableRow>
                            <TableRow>{date.snow["3h"]} mm</TableRow>
                            <TableRow>(last 3 hours)</TableRow>
                          </>
                        )}
                      </Table>
                    )
                )}
              </TableContainer>
              <GraphComponent data={list} isMetricUnits={isMetricUnits} />
            </details>
          </>
        )}
      </ForecastWeatherSection>
    </>
  );
}

export default ForecastComponent;
