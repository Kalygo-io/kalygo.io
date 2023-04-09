import { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { useResize } from "../../../../hooks/useResize";
import { drawStaticElements } from "./helpers/drawStaticElements";
import { drawAnimatedElements } from "./helpers/drawAnimatedElements";
import { clearAnimatedElements } from "./helpers/clearAnimatedElements";

interface P {
  events: {
    color: string;
    title: string;
    ts: number;
  }[];
}

export const D3Timeline = (props: P) => {
  const { events } = props;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const size = useResize(rootRef);
  // related to animation
  const animationRef = useRef<{
    requestId: number | null;
    previousTime: number | null;
    elapsedFrame: number;
  }>({
    requestId: null,
    previousTime: null,
    elapsedFrame: 0,
  });

  useEffect(() => {
    select(rootRef.current)?.select("svg").remove();

    if (size) {
      select(rootRef.current)
        .append("svg")
        .attr("width", size.width)
        .attr("height", size.height);

      const now = Date.now();
      drawStaticElements(rootRef.current!, size, events, now);
    }
  }, [size]);

  useEffect(() => {
    animationRef.current.requestId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current.requestId!);
  }, [size]); // Make sure the effect runs only once

  const animate = (time: any) => {
    // console.log("animate");
    const FRAME_RATE = 1000 / 24; // in milliseconds ie : 2 is the amount of frames/sec
    const now = Date.now();
    if (animationRef.current.previousTime !== undefined) {
      const deltaTime = time - animationRef.current.previousTime!;
      animationRef.current.elapsedFrame! += deltaTime;
      if (
        animationRef.current.elapsedFrame > FRAME_RATE &&
        // now < events[events.length - 1].ts &&
        size
      ) {
        clearAnimatedElements(rootRef.current!);
        drawAnimatedElements(rootRef.current!, size, events, now);
        animationRef.current.elapsedFrame = 0;
      }
    }
    animationRef.current.previousTime = time;
    animationRef.current.requestId = requestAnimationFrame(animate);
  };

  return (
    <div ref={rootRef} id="d3-timeline-widget">
      D3Timeline
    </div>
  );
};
