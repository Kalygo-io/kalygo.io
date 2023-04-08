import { select } from "d3-selection";
import { drawTimeline } from "./staticElements/drawTimeline";
import { drawBg } from "./staticElements/drawBg";
import { drawTimelineEvents } from "./staticElements/drawTimelineEvents";

export const drawStaticElements = (
  rootElement: HTMLDivElement,
  windowSize: { width: number; height: number },
  timelineEvents: {
    color: string;
    ts: number;
    title: string;
  }[]
) => {
  drawBg(rootElement, windowSize);
  drawTimeline(rootElement, windowSize, timelineEvents);
  drawTimelineEvents(rootElement, windowSize, timelineEvents);
};
