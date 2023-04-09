import React from "react";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { getColorForPercentage } from "../utility/getColorForPercentage";

export const drawCurrentTime = (
  rootElement: HTMLDivElement,
  windowSize: { width: number; height: number },
  timelineEvents: {
    color: string;
    ts: number;
    title: string;
  }[],
  currentTime: number
) => {
  const { width, height } = windowSize!;

  const PADDING = width / 10;
  const scale = scaleLinear()
    .domain([
      timelineEvents[0].ts,
      timelineEvents[timelineEvents.length - 1].ts,
    ])
    .range([0 + PADDING, width - PADDING]);

  select(rootElement)
    .select("svg")
    .append("g")
    .append("circle")
    .attr("r", 10)
    .attr("class", "current-time")
    .attr("cx", (d: any) => {
      return scale(currentTime);
    })
    .attr("cy", (d: any) => {
      return height * (2 / 5);
    })
    .style("fill", (d) => {
      // Step 1 - Calculate %

      console.log(scale(currentTime));
      console.log(scale(currentTime));

      const pct = (scale(currentTime) - PADDING) / (width - PADDING);

      console.log("percentage is:", pct);

      // [0 + PADDING, width - PADDING]

      // Step 2 - getColorForPercentage()

      const clr = getColorForPercentage(
        pct,
        {
          r: 97,
          g: 218,
          b: 251,
        },
        {
          r: 250,
          g: 82,
          b: 82,
        }
      );

      console.log("clr", clr);

      // Color One BLUE - rgb(97, 218, 251)
      // Color One RED - rgb(250, 82, 82)

      // return "#5bcfef";
      return clr;
    })
    .attr("stroke", "rgba(0,0,0,1)");
};
