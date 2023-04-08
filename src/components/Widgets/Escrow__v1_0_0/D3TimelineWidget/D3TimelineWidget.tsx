import React, { useRef } from "react";
import { useResize } from "../../../../hooks/useResize";

interface P {
  events: any;
}

export const D3TimelineWidget = (props: P) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const size = useResize(rootRef);

  console.log("render");

  return <div ref={rootRef} id="d3-timeline-widget"></div>;
};
