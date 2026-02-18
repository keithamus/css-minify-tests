document.addEventListener(
  "command",
  (e) => {
    if (e.command === "--expand" || e.command == "--collapse") {
      const open = e.command === "--expand";
      for (const d of e.target.querySelectorAll("details")) d.open = open;
    }
  },
  true,
);

document.addEventListener(
  "toggle",
  (e) => {
    const root = e.target.closest("table");
    const btn = document.querySelector(`button[commandfor='${root.id}']`);
    const globalButton = document.querySelector('button[commandfor="results"]');
    for (const d of root.querySelectorAll("details")) {
      if (!d.open) {
        globalButton.textContent = btn.textContent = "Expand all";
        globalButton.command = btn.command = "--expand";
        return;
      }
    }
    globalButton.textContent = btn.textContent = "Collapse all";
    globalButton.command = btn.command = "--collapse";
  },
  true,
);

function openHash() {
  const hash = location.hash.slice(1) || "";
  const el = document.getElementById(hash);
  const row = el?.closest("tr");
  if (!row) return;
  const details = row.nextElementSibling?.querySelector("details");
  if (details) details.open = true;
  el.scrollIntoView();
}

openHash();
window.addEventListener("hashchange", openHash);

// Historical trend chart
(function () {
  const el = document.getElementById("pass-rate-chart");
  if (!el || typeof ApexCharts === "undefined") return;
  const data = window.historyData;
  if (!data || data.length < 2) return;

  const reversed = [...data].reverse();
  const minifierNames = Object.keys(reversed[0].minifiers);

  const series = minifierNames.map((name) => ({
    name,
    data: reversed
      .map((entry) => {
        const m = entry.minifiers[name];
        if (!m || m.total === 0) return null;
        return {
          x: new Date(entry.date).getTime(),
          y: Math.round((m.pass / m.total) * 1000) / 10,
        };
      })
      .filter(Boolean),
  }));

  const isDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const chart = new ApexCharts(el, {
    series,
    chart: {
      type: "line",
      height: 400,
      background: isDark ? "#0f0f0f" : "#ffffff",
      zoom: { enabled: true },
      toolbar: { show: true },
      animations: { enabled: false },
    },
    stroke: { curve: "straight", width: 2 },
    dataLabels: { enabled: false },
    xaxis: {
      type: "datetime",
      title: { text: "Date" },
      labels: {
        datetimeUTC: false,
      },
    },
    yaxis: {
      title: { text: "Pass Rate (%)" },
      min: 0,
      max: 100,
      decimalsInFloat: 1,
    },
    tooltip: {
      shared: true,
      intersect: false,
      x: { format: "MMM dd, yyyy" },
      y: {
        formatter(y, { seriesIndex, dataPointIndex, w }) {
          if (typeof y !== "number" || isNaN(y)) return y;
          const name = w.config.series[seriesIndex].name;
          const entry = reversed[dataPointIndex];
          const m = entry && entry.minifiers[name];
          const extra = m ? ` (${m.pass}/${m.total} v${m.version})` : "";
          return y.toFixed(1) + "%" + extra;
        },
      },
    },
    legend: { position: "bottom" },
    grid: {
      borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
    },
    theme: isDark ? { mode: "dark", palette: "palette4" } : { mode: "light" },
  });
  chart.render();

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const dark = e.matches;
      chart.updateOptions({
        chart: { background: dark ? "#0f0f0f" : "#ffffff" },
        grid: {
          borderColor: dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
        },
        theme: dark ? { mode: "dark", palette: "palette4" } : { mode: "light" },
      });
    });
})();
