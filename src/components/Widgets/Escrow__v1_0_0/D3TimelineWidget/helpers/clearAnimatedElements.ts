import { select } from "d3-selection";

export const clearAnimatedElements = (rootElement: HTMLDivElement) => {
  select(rootElement).select(".current-time")?.remove();
};
