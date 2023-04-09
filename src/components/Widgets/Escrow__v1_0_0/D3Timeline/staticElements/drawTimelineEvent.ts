import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";

export const drawTimelineEvent = (
  rootElement: HTMLDivElement,
  windowSize: { width: number; height: number },
  timelineEvents: {
    color: string;
    ts: number;
    title: string;
  }[],
  event: number,
  color: "red" | "blue"
) => {
  const { width, height } = windowSize;

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
    .attr("r", 8)
    .attr("class", "expired")
    .attr("cx", (d: any) => {
      return scale(event);
    })
    .attr("cy", (d: any) => {
      return height * (1 / 2);
    })
    .style("fill", color)
    .attr("stroke", "rgba(0,0,0,1)");
};
