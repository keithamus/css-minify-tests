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
