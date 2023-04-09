import { useRef } from "react";

export const D3Timeline = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={rootRef} id="d3-timeline-widget">
      D3Timeline
    </div>
  );
};
