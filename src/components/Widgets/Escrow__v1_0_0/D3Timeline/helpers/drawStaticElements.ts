import { select } from "d3-selection";
import { drawTimeline } from "../staticElements/drawTimeline";
import { drawTimelineEvents } from "../staticElements/drawTimelineEvents";

export const drawStaticElements = (
  rootElement: HTMLDivElement,
  windowSize: { width: number; height: number },
  timelineEvents: {
    color: string;
    ts: number;
    title: string;
  }[]
) => {
  const { width, height } = windowSize;

  select(rootElement)
    .select("svg")
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "#61DAFB");
  // .attr("fill", "#f5f8fb");

  drawTimeline(rootElement, windowSize, timelineEvents);
  drawTimelineEvents(rootElement, windowSize, timelineEvents);
};
