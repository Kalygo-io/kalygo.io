import { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { useResize } from "../../../../hooks/useResize";

export const D3Timeline = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const size = useResize(rootRef);

  useEffect(() => {
    select(rootRef.current)?.select("svg").remove();

    if (size) {
      select(rootRef.current)
        .append("svg")
        .attr("width", size.width)
        .attr("height", size.height);
    }
  }, [size]);

  return (
    <div ref={rootRef} id="d3-timeline-widget">
      D3Timeline
    </div>
  );
};