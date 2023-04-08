import React from "react";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";

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
      return "#5bcfef";
    })
    .attr("stroke", "rgba(0,0,0,1)");
};
