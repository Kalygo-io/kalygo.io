import { drawCurrentTime } from "../animatedElements/drawCurrentTime";

export const drawAnimatedElements = (
  rootElement: HTMLDivElement,
  windowSize: { width: number; height: number },
  timelineEvents: {
    color: string;
    ts: number;
    title: string;
  }[],
  now: number
) => {
  drawCurrentTime(rootElement, windowSize, timelineEvents, now);
};
