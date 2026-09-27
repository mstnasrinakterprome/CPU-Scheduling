import { colorFor } from "../data/algorithms";

export default function GanttChart({ segments, order }) {
  const totalTime = segments.length ? segments[segments.length - 1].end : 1;
  const ticks = [];

  segments.forEach((s) => {
    if (!ticks.includes(s.start)) ticks.push(s.start);
  });
  ticks.push(totalTime);

  return (
    <div className="mt-5">
      <div className="flex h-14 w-full overflow-hidden rounded-xl border border-slate-700/70 bg-slate-950">
        {segments.map((segment, index) => {
          const width = ((segment.end - segment.start) / totalTime) * 100;
          const isIdle = segment.id === "idle";

          return (
            <div
              key={`${segment.id}-${index}`}
              className="flex min-w-[3px] items-center justify-center border-r border-slate-900/40 text-xs font-bold"
              style={{
                width: `${width}%`,
                background: isIdle ? "#334155" : colorFor(segment.id, order),
                color: isIdle ? "#94a3b8" : "#0f172a",
              }}
              title={`${isIdle ? "Idle" : segment.id}: ${segment.start} - ${segment.end}`}
            >
              <span className="truncate px-1">{isIdle ? "IDLE" : segment.id}</span>
            </div>
          );
        })}
      </div>

      <div className="relative h-7 font-mono text-[10px] text-slate-500">
        {ticks.map((tick, index) => (
          <span
            key={`${tick}-${index}`}
            className="absolute -translate-x-1/2 pt-1"
            style={{ left: `${(tick / totalTime) * 100}%` }}
          >
            {tick}
          </span>
        ))}
      </div>
    </div>
  );
}
