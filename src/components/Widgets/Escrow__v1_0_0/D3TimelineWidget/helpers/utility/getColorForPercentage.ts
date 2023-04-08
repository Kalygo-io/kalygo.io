export const getColorForPercentage = function (
  pct: number,
  color1: { r: number; g: number; b: number },
  color2: {
    r: number;
    g: number;
    b: number;
  }
) {
  // for (var i = 1; i < percentColors.length - 1; i++) {
  //     if (pct < percentColors[i].pct) {
  //         break;
  //     }
  // }
  var lower = color1;
  var upper = color2;
  var range = 1;
  var rangePct = (pct - 0) / range;
  var pctLower = 1 - rangePct;
  var pctUpper = rangePct;
  var color = {
    r: Math.floor(lower.r * pctLower + upper.r * pctUpper),
    g: Math.floor(lower.g * pctLower + upper.g * pctUpper),
    b: Math.floor(lower.b * pctLower + upper.b * pctUpper),
  };
  return "rgb(" + [color.r, color.g, color.b].join(",") + ")";
  // or output as hex if preferred
};
