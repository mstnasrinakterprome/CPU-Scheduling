function finalize(segments, table) {
  const merged = [];
  for (const segment of segments) {
    const last = merged[merged.length - 1];
    if (last && last.id === segment.id && last.end === segment.start) {
      last.end = segment.end;
    } else {
      merged.push({ ...segment });
    }
  }

  const totalTime = merged.length ? merged[merged.length - 1].end : 0;
  const idleTime = merged
    .filter((s) => s.id === "idle")
    .reduce((sum, s) => sum + (s.end - s.start), 0);

  const n = table.length;
  const avgWT = n ? table.reduce((sum, row) => sum + row.wt, 0) / n : 0;
  const avgTAT = n ? table.reduce((sum, row) => sum + row.tat, 0) / n : 0;

  return { segments: merged, table, totalTime, idleTime, avgWT, avgTAT };
}

function simulateFCFS(procs) {
  const sorted = [...procs].sort((a, b) => a.at - b.at || a.order - b.order);
  let time = 0;
  const segments = [];
  const table = [];

  for (const p of sorted) {
    if (time < p.at) {
      segments.push({ id: "idle", start: time, end: p.at });
      time = p.at;
    }
    const start = time;
    const end = time + p.bt;
    segments.push({ id: p.id, start, end });

    const ct = end;
    const tat = ct - p.at;
    const wt = tat - p.bt;
    table.push({ ...p, ct, tat, wt });
    time = end;
  }

  table.sort((a, b) => a.order - b.order);
  return finalize(segments, table);
}

function simulateSJF(procs) {
  const completed = new Set();
  let time = 0;
  const segments = [];
  const table = [];

  while (completed.size < procs.length) {
    const available = procs.filter((p) => p.at <= time && !completed.has(p.id));

    if (!available.length) {
      const remaining = procs.filter((p) => !completed.has(p.id));
      const nextArrival = Math.min(...remaining.map((p) => p.at));
      segments.push({ id: "idle", start: time, end: nextArrival });
      time = nextArrival;
      continue;
    }

    available.sort((a, b) => a.bt - b.bt || a.at - b.at || a.order - b.order);
    const pick = available[0];
    const start = time;
    const end = time + pick.bt;

    segments.push({ id: pick.id, start, end });

    const ct = end;
    const tat = ct - pick.at;
    const wt = tat - pick.bt;
    table.push({ ...pick, ct, tat, wt });

    completed.add(pick.id);
    time = end;
  }

  table.sort((a, b) => a.order - b.order);
  return finalize(segments, table);
}

function simulatePriority(procs) {
  const completed = new Set();
  let time = 0;
  const segments = [];
  const table = [];

  while (completed.size < procs.length) {
    const available = procs.filter((p) => p.at <= time && !completed.has(p.id));

    if (!available.length) {
      const remaining = procs.filter((p) => !completed.has(p.id));
      const nextArrival = Math.min(...remaining.map((p) => p.at));
      segments.push({ id: "idle", start: time, end: nextArrival });
      time = nextArrival;
      continue;
    }

    available.sort((a, b) => a.priority - b.priority || a.at - b.at || a.order - b.order);
    const pick = available[0];
    const start = time;
    const end = time + pick.bt;

    segments.push({ id: pick.id, start, end });

    const ct = end;
    const tat = ct - pick.at;
    const wt = tat - pick.bt;
    table.push({ ...pick, ct, tat, wt });

    completed.add(pick.id);
    time = end;
  }

  table.sort((a, b) => a.order - b.order);
  return finalize(segments, table);
}

function simulateSRTF(procs) {
  const remaining = {};
  procs.forEach((p) => (remaining[p.id] = p.bt));

  const completionTimes = {};
  let time = 0;
  let completedCount = 0;
  const segments = [];

  const maxTime =
    procs.reduce((sum, p) => sum + p.bt, 0) +
    Math.max(...procs.map((p) => p.at)) +
    1;

  while (completedCount < procs.length && time < maxTime * 2) {
    const available = procs.filter((p) => p.at <= time && remaining[p.id] > 0);

    if (!available.length) {
      const upcoming = procs.filter((p) => remaining[p.id] > 0);
      const nextArrival = Math.min(...upcoming.map((p) => p.at));
      segments.push({ id: "idle", start: time, end: nextArrival });
      time = nextArrival;
      continue;
    }

    available.sort(
      (a, b) =>
        remaining[a.id] - remaining[b.id] ||
        a.at - b.at ||
        a.order - b.order
    );

    const pick = available[0];
    segments.push({ id: pick.id, start: time, end: time + 1 });
    remaining[pick.id] -= 1;
    time += 1;

    if (remaining[pick.id] === 0) {
      completionTimes[pick.id] = time;
      completedCount += 1;
    }
  }

  const table = procs
    .map((p) => {
      const ct = completionTimes[p.id];
      const tat = ct - p.at;
      const wt = tat - p.bt;
      return { ...p, ct, tat, wt };
    })
    .sort((a, b) => a.order - b.order);

  return finalize(segments, table);
}

function simulateRR(procs, quantum) {
  const q = Math.max(1, quantum || 1);
  const sortedByArrival = [...procs].sort(
    (a, b) => a.at - b.at || a.order - b.order
  );

  const remaining = {};
  procs.forEach((p) => (remaining[p.id] = p.bt));

  const completionTimes = {};
  const queue = [];
  let idx = 0;
  let time = sortedByArrival.length ? sortedByArrival[0].at : 0;

  while (idx < sortedByArrival.length && sortedByArrival[idx].at <= time) {
    queue.push(sortedByArrival[idx]);
    idx++;
  }

  const segments = [];
  let completedCount = 0;

  while (completedCount < procs.length) {
    if (!queue.length) {
      if (idx < sortedByArrival.length) {
        const nextArrival = sortedByArrival[idx].at;
        if (nextArrival > time) {
          segments.push({ id: "idle", start: time, end: nextArrival });
        }
        time = Math.max(time, nextArrival);

        while (idx < sortedByArrival.length && sortedByArrival[idx].at <= time) {
          queue.push(sortedByArrival[idx]);
          idx++;
        }
      }
      continue;
    }

    const p = queue.shift();
    const exec = Math.min(q, remaining[p.id]);
    const start = time;
    const end = time + exec;

    segments.push({ id: p.id, start, end });
    time = end;
    remaining[p.id] -= exec;

    while (idx < sortedByArrival.length && sortedByArrival[idx].at <= time) {
      queue.push(sortedByArrival[idx]);
      idx++;
    }

    if (remaining[p.id] > 0) {
      queue.push(p);
    } else {
      completionTimes[p.id] = time;
      completedCount += 1;
    }
  }

  const table = procs
    .map((p) => {
      const ct = completionTimes[p.id];
      const tat = ct - p.at;
      const wt = tat - p.bt;
      return { ...p, ct, tat, wt };
    })
    .sort((a, b) => a.order - b.order);

  return finalize(segments, table);
}

export function runAlgorithm(algoId, procs, quantum) {
  switch (algoId) {
    case "fcfs":
      return simulateFCFS(procs);
    case "sjf":
      return simulateSJF(procs);
    case "srtf":
      return simulateSRTF(procs);
    case "priority":
      return simulatePriority(procs);
    case "rr":
      return simulateRR(procs, quantum);
    default:
      return null;
  }
}
