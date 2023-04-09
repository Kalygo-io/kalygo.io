import React, { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { useResize } from "../../../../hooks/useResize";
import { drawStaticElements } from "./helpers/drawStaticElements";
import { drawAnimatedElements } from "./helpers/drawAnimatedElements";
import { clearAnimatedElements } from "./helpers/clearAnimatedElements";

interface P {
  events: any;
}

export const D3TimelineWidget = (props: P) => {
  let { events } = props;

  // console.log("events", events);
  // events = [...events.slice(0, 3), ...events.slice(4)];
  // console.log("events", events);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const size = useResize(rootRef);

  // related to animation
  const animationRef = React.useRef<{
    requestId: number | null;
    previousTime: number | null;
    elapsedFrame: number;
  }>({
    requestId: null,
    previousTime: null,
    elapsedFrame: 0,
  });

  useEffect(() => {
    console.log("D3TimelineWidget useEffect");
    select(rootRef.current).select("svg").remove();

    if (size) {
      // prettier-ignore
      select(rootRef.current).append("svg").attr("width", size.width).attr("height", size.height).style("border", "1px solid rgb(234,237,242)").style("border-radius", "0.4375rem");
      drawStaticElements(rootRef.current!, size, events);
      // prettier-ignore
      Date.now() < events[events.length - 1].ts && drawAnimatedElements(rootRef.current!, size, events, Date.now());
    }
  }, [size]);

  React.useEffect(() => {
    animationRef.current.requestId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current.requestId!);
  }, [size]); // Make sure the effect runs only once

  const animate = (time: any) => {
    console.log("animate");

    const FRAME_RATE = 1 / 10;
    const now = Date.now();

    if (animationRef.current.previousTime !== undefined) {
      const deltaTime = time - animationRef.current.previousTime!;

      animationRef.current.elapsedFrame! += deltaTime;

      if (
        animationRef.current.elapsedFrame > FRAME_RATE &&
        now < events[events.length - 1].ts &&
        size
      ) {
        clearAnimatedElements(rootRef.current!);
        drawAnimatedElements(rootRef.current!, size, events, now);
      }
    }

    animationRef.current.previousTime = time;
    animationRef.current.requestId = requestAnimationFrame(animate);
  };

  return <div ref={rootRef} id="d3-timeline-widget"></div>;
};
