import { select } from "d3-selection";
import { drawTimeline } from "../staticElements/drawTimeline";
import { drawTimelineEvents } from "../staticElements/drawTimelineEvents";
import { drawTimelineEvent } from "../staticElements/drawTimelineEvent";
import { drawBg } from "../staticElements/drawBg";

export const drawStaticElements = (
  rootElement: HTMLDivElement,
  windowSize: { width: number; height: number },
  timelineEvents: {
    color: string;
    ts: number;
    title: string;
  }[],
  currentTime: number
) => {
  const { width, height } = windowSize;

  drawBg(rootElement, windowSize);
  drawTimeline(rootElement, windowSize, timelineEvents);
  drawTimelineEvents(rootElement, windowSize, timelineEvents);

  if (timelineEvents[timelineEvents.length - 1].ts <= currentTime) {
    // prettier-ignore
    drawTimelineEvent(rootElement, windowSize, timelineEvents, timelineEvents[timelineEvents.length - 1].ts, "red");
  }
};
