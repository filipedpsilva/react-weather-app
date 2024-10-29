import styled from "styled-components";
import { BasicTooltip } from "@nivo/tooltip";
import { Datum, PointTooltipProps, Serie, ResponsiveLine } from "@nivo/line";

import { NOON_TIME, MIDNIGHT_TIME, DEVICE_SIZES } from "src/app/data/constants";
import { List } from "src/app/data/interfaces";
import { getTemperatureUnit } from "src/app/helpers/helpers";

// #region Styling

const ResponsiveStreamGraph = styled.div`
  height: 40vh;
  color: #000000;
  background-color: rgba(24, 20, 80, 0.75);
  border-radius: 16px;
  margin: 0 1rem;

  @media only screen and (max-width: ${DEVICE_SIZES.tablet}) {
    margin: 1rem 0 0 0;
    height: 70vh;
    width: 80vw;
  }
`;
// #endregion Styling

interface GraphComponentProps {
  data: List[];
  isMetricUnits: boolean;
  isMobile?: boolean;
}

function GraphComponent(props: GraphComponentProps): JSX.Element {
  const { data, isMetricUnits, isMobile } = props;
  const tempData: Datum[] = [];

  data.forEach((entry) => {
    const meetsFilter = isMobile
      ? entry.dt_txt.toString().includes(NOON_TIME)
      : entry.dt_txt.toString().includes(NOON_TIME) ||
        entry.dt_txt.toString().includes(MIDNIGHT_TIME);
    if (meetsFilter) {
      tempData.push({
        x: new Date(entry.dt_txt),
        y: entry.main.temp,
      });
    }
  });

  const DATA: Serie[] = [
    {
      id: "Temp",
      data: tempData,
    },
  ];

  function tooltip(value: PointTooltipProps): JSX.Element {
    return (
      <BasicTooltip
        id={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span>
              <strong>{value.point.data.xFormatted}</strong>
            </span>
            <span>
              {`${value.point.data.yFormatted}${getTemperatureUnit(
                isMetricUnits
              )}`}
            </span>
          </div>
        }
        enableChip={false}
        color={value.point.serieColor}
      />
    );
  }

  const margin = isMobile
    ? { top: 50, right: 20, bottom: 50, left: 20 }
    : { top: 50, right: 40, bottom: 50, left: 40 };

  const format = isMobile ? "%H:%M" : "%a %d, %H:%M";

  return (
    <ResponsiveStreamGraph>
      <ResponsiveLine
        data={DATA}
        theme={{
          text: {
            fill: "#fff",
          },
        }}
        margin={margin}
        xScale={{
          type: "time",
          format: "%d %H:%M",
          precision: "hour",
          useUTC: false,
          nice: true,
        }}
        xFormat={"time:%a %d, %H:%M"}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          reverse: false,
          stacked: true,
        }}
        yFormat={` >-.2f`}
        curve="cardinal"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendOffset: 0,
          legendPosition: "end",
          truncateTickAt: 0,
          format,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          legend:
            !isMobile && `Temperature (${getTemperatureUnit(isMetricUnits)})`,
          legendOffset: -25,
          legendPosition: "middle",
          truncateTickAt: 0,
          renderTick: () => <></>,
        }}
        colors={["rgba(255,255,255,0.75)"]}
        lineWidth={4}
        pointSize={10}
        pointColor={"#fff"}
        pointBorderWidth={5}
        pointBorderColor={{ from: "serieColor" }}
        enablePointLabel
        tooltipFormat={" >-.2f"}
        tooltip={tooltip}
        pointLabel={(e) => `${e.data.yFormatted}º`}
        pointLabelYOffset={-25}
        enableTouchCrosshair={true}
        enableGridY={false}
        useMesh={true}
      />
    </ResponsiveStreamGraph>
  );
}

export default GraphComponent;
