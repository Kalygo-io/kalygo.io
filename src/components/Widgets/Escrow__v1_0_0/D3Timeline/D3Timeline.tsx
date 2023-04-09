import { useEffect, useRef } from "react";
import { useResize } from "../../../../hooks/useResize";

export const D3Timeline = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const size = useResize(rootRef);

  useEffect(() => {
    console.log("D3TimelineWidget useEffect");
    console.log("size", size);
  }, [size]);

  return (
    <div ref={rootRef} id="d3-timeline-widget">
      D3Timeline
    </div>
  );
};
