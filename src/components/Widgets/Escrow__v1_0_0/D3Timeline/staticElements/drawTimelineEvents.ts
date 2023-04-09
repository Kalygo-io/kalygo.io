import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";

export const drawTimelineEvents = (
  rootElement: HTMLDivElement,
  windowSize: { width: number; height: number },
  timelineEvents: {
    color: string;
    ts: number;
    title: string;
  }[]
) => {
  const { width, height } = windowSize!;

  const PADDING = width / 10;
  const scale = scaleLinear()
    .domain([
      timelineEvents[0].ts,
      timelineEvents[timelineEvents.length - 1].ts,
    ])
    .range([0 + PADDING, width - PADDING]);

  select(rootElement)
    .select("svg")
    .append("g")
    .selectAll(".timeline-event")
    .data(timelineEvents)
    .enter()
    .append("circle")
    .attr("r", 8)
    .attr("class", "timeline-event")
    .attr("cy", function (d) {
      return 0;
    })
    .attr("cx", function (d) {
      //   console.log(d);
      console.log("---", scale(d.ts));

      return scale(d.ts);
    })
    .attr("transform", `translate(${0}, ${height * (2 / 5)})`)
    .attr("fill", function (d) {
      return d.color;
    })
    .attr("stroke", "rgba(0,0,0,1)")
    .on("mouseover", function (d, i) {
      select(rootElement)
        .select("svg")
        .append("text")
        .attr("class", "timeline-event-text")
        .attr("font-family", "Arial")
        .attr("font-size", "16px")
        .attr("y", height * (2 / 5) - 16 - 10)
        .attr("x", function (_d: any) {
          return scale(d.target.__data__.ts);
        })
        .attr("text-anchor", function (innerD: any) {
          if (scale(d.target.__data__.ts) > width * (3 / 4)) {
            return "end";
          } else if (scale(d.target.__data__.ts) > width / 2) {
            return "middle";
          } else {
            return "start";
          }
        })
        .style("fill", "#004669")
        .style("font-weight", "bold")
        .text(`${i.title}`)
        .append("tspan")
        .text(`${new Date(i.ts).toLocaleString()}`)
        .attr("x", scale(d.target.__data__.ts))
        .attr("y", height * (2 / 5) - 32 - 10);
    })
    .on("mouseout", function (d, i) {
      select(rootElement).selectAll("text.timeline-event-text").remove();
    });
};
