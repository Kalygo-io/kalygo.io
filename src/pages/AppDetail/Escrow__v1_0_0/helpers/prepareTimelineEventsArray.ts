import get from "lodash/get";

export function prepareTimelineEventsArray(app: object) {
  // const now = {
  //   title: "Now",
  //   ts: new Date().getTime(),
  //   color: "#60dafb",
  // };

  console.log("app", app);
  debugger;

  const inspectPeriodStart = {
    title: "Inspection Begins",
    ts: new Date(get(app, "val.glbl_inspect_start_date", 0) * 1000).getTime(),
    color: "rgb(245,245,245)",
  };

  const inspectPeriodEnd = {
    title: "Inspection Ends",
    ts: new Date(get(app, "val.glbl_inspect_end_date", 0) * 1000).getTime(),
    color: "rgb(220,220,220)",
  };

  const inspectExtension = {
    title: "Inspection Extension",
    ts: new Date(
      get(app, "val.glbl_inspect_extension_date", 0) * 1000
    ).getTime(),
    color: "rgb(190,190,190)",
  };

  const closingDate = {
    title: "Closing Date",
    ts: new Date(get(app, "val.glbl_closing_date", 0) * 1000).getTime(),
    color: "rgb(96,96,96)",
  };

  const closingDateExtension = {
    title: "Closing Date Extension",
    ts: new Date(
      get(app, "val.glbl_closing_extension_date", 0) * 1000
    ).getTime(),
    color: "rgb(32,32,32)",
  };

  let timelineEvents = [
    // now,
    inspectPeriodStart,
    inspectPeriodEnd,
    inspectExtension,
    closingDate,
    closingDateExtension,
  ];

  function compare(a: any, b: any) {
    if (a.ts < b.ts) {
      return -1;
    }
    if (a.ts > b.ts) {
      return 1;
    }
    return 0;
  }

  timelineEvents.sort(compare);

  debugger;

  return {
    timeline: timelineEvents,
    // now: now.ts,
    inspectPeriodStart: inspectPeriodStart.ts,
    inspectPeriodEnd: inspectPeriodEnd.ts,
    inspectExtension: inspectExtension.ts,
    closingDate: closingDate.ts,
    closingDateExtension: closingDateExtension.ts,
  };
}
