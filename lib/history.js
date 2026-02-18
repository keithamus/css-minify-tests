import fs from "node:fs/promises";

const HISTORY_PATH = "results-history.json";

export async function readHistory() {
  try {
    const raw = await fs.readFile(HISTORY_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function appendHistory(results, versions) {
  const history = await readHistory();

  const entry = {
    date: new Date().toISOString(),
    testCount: 0,
    minifiers: {},
  };

  for (const [name, data] of Object.entries(results.minifiers)) {
    entry.minifiers[name] = {
      version: versions[name] || null,
      pass: data.pass,
      total: data.checks,
    };
    entry.testCount = Math.max(entry.testCount, data.checks);
  }

  // Dedup: if latest entry has same versions + same test count, overwrite it
  if (history.length > 0) {
    const latest = history[0];
    const same =
      latest.testCount === entry.testCount &&
      Object.keys(entry.minifiers).every((name) => {
        const prev = latest.minifiers[name];
        const curr = entry.minifiers[name];
        return prev && curr && prev.version === curr.version;
      }) &&
      Object.keys(latest.minifiers).every((name) => entry.minifiers[name]);

    if (same) {
      history[0] = entry;
    } else {
      history.unshift(entry);
    }
  } else {
    history.unshift(entry);
  }

  await fs.writeFile(HISTORY_PATH, JSON.stringify(history, null, 2) + "\n");
  return history;
}
