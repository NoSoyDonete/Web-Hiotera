const paths = {
  farm: "M3 21V7l7-4 7 4v14M7 21v-4h6v4M7 8v2m5-2v2m-5 3v1m5-1v1m5-6h4v13H3",
  chart: "M4 3v17h17M7 14l4-5 4 3 6-8M8 17v-2m4 2v-3m4 3v-2m4 2V9",
  history: "M3 12h3l3-8 4 15 3-8 3 1h2",
  book: "M12 5c-4-3-8-2-9-1v15c3-2 6-2 9 0m0-14c4-3 8-2 9-1v15c-3-2-6-2-9 0V5",
  weather:
    "M8 17a5 5 0 1 1 6-7 4 4 0 1 1 2 8H8M12 2v2m-8 1 2 2m-4 5h2m15-7-2 2m5 4h-2",
  bell: "M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3Zm5 3h4M3 10a9 9 0 0 1 2-6m16 6a9 9 0 0 0-2-6",
  settings: "M4 6h5m4 0h7M4 12h10m4 0h2M4 18h2m4 0h10M9 3v6m5 0v6M6 15v6",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 5 5",
  layers: "m3 8 9-5 9 5-9 5-9-5Zm0 5 9 5 9-5M3 18l9 5 9-5",
  sprout:
    "M12 21V11M12 15C4 16 3 10 4 7c6 0 9 3 8 8Zm0-4c-1-6 2-8 8-8 1 6-3 9-8 8ZM7 21h10",
  location:
    "M12 22s8-8 8-14a8 8 0 0 0-16 0c0 6 8 14 8 14Zm0-11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  map: "m3 5 6-3 6 3 6-3v17l-6 3-6-3-6 3V5Zm6-3v17m6-14v17",
  antenna:
    "M12 10v11m-3 0h6M8 7a6 6 0 0 0 0 9m8-9a6 6 0 0 1 0 9M5 4a10 10 0 0 0 0 15M19 4a10 10 0 0 1 0 15M12 8v1",
  list: "M8 5h13M8 12h13M8 19h13M3 5h1m-1 7h1m-1 7h1",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  down: "m6 9 6 6 6-6",
  right: "m9 5 7 7-7 7",
  plus: "M12 4v16M4 12h16",
  close: "m6 6 12 12M6 18 18 6",
  check: "m5 12 4 4L20 5",
  up: "M12 20V4m-6 6 6-6 6 6",
  low: "M12 4v16m-6-6 6 6 6-6",
  refresh: "M20 8a8 8 0 0 0-14-3L3 8m0-5v5h5m-4 8a8 8 0 0 0 14 3l3-3m0 5v-5h-5",
  battery: "M3 7h16v10H3V7Zm18 3v4M6 10v4m3-4v4m3-4v4",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-16v6l4 2",
  bulb: "M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0l-1 2H9l-1-2Z",
  calendar:
    "M4 5h16v16H4V5Zm3-3v6m10-6v6M4 11h16m-12 4h1m3 0h1m3 0h1m-9 3h1m3 0h1",
  gauge: "M4 17a9 9 0 1 1 16 0M12 13l4-5M7 18h10",
  help: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm-3-14a3 3 0 1 1 5 2l-2 2v2m0 3v1",
  compass: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm4-16-3 7-7 3 3-7 7-3Z",
  robot:
    "M5 5h14v14H5V5Zm3 3h8v8H8V8Zm4-7v4m-7 7H1m22 0h-4M8 19l-2 4m10-4 2 4M10 11l2 3 3-4",
  wind: "M3 8h13a3 3 0 1 0-3-3M3 12h17a2 2 0 1 1-2 2M3 16h8a3 3 0 1 1-3 3",
};

export function AppIcon({ name, size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] ?? paths.chart} />
    </svg>
  );
}

export function CropPlant({ stage = 3 }) {
  const leaves = [
    [44, 72, -40],
    [62, 65, 35],
    [44, 52, -48],
    [63, 42, 38],
    [48, 34, -32],
    [60, 23, 28],
    [34, 61, -55],
    [73, 55, 48],
    [37, 37, -38],
    [76, 29, 35],
  ];
  return (
    <svg viewBox="0 0 110 120" className="replica-plant" aria-hidden="true">
      <ellipse cx="55" cy="113" rx="18" ry="5" fill="#9ba58b" opacity=".25" />
      <path
        d="M53 109q8-45 1-90m1 69L36 59m20 10 20-25m-22 8L37 33"
        fill="none"
        stroke="#789333"
        strokeWidth="3"
      />
      {leaves
        .slice(0, stage === 0 ? 4 : stage === 1 ? 7 : 10)
        .map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
            <path
              d="M0 1Q-15-21-25-14Q-26 3 0 1Z"
              fill={i % 2 ? "#427d25" : "#6d9533"}
            />
            <path d="m-22-13 20 13" stroke="#93ac58" strokeWidth=".8" />
          </g>
        ))}
      {stage > 1 &&
        [35, 62, 74].map((x, i) => (
          <g key={x} transform={`translate(${x} ${46 + i * 17})`}>
            <path
              d="M0 0q-7 2-4 15t9-2Q10 2 0 0"
              fill={stage === 4 ? "#bd3824" : "#3e7f25"}
            />
            <path d="m0 0 1-5" stroke="#677d28" strokeWidth="2" />
          </g>
        ))}
    </svg>
  );
}
