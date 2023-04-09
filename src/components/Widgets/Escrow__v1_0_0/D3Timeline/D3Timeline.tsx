import { useRef } from "react";
import { useResize } from "../../../../hooks/useResize";

export const D3Timeline = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const size = useResize(rootRef);

  console.log("render");

  return (
    <div ref={rootRef} id="d3-timeline-widget">
      D3Timeline
    </div>
  );
};
