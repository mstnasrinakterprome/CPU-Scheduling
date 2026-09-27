const stats = [
  ["Average waiting time", "avgWT"],
  ["Average turnaround time", "avgTAT"],
  ["Total CPU idle time", "idleTime"],
];

export default function StatCards({ result }) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      {stats.map(([label, key]) => (
        <div
          key={key}
          className="rounded-xl border border-slate-700/60 bg-slate-950/60 p-4"
        >
          <p className="text-xs text-slate-500">{label}</p>
          <p className="mt-1 font-mono text-2xl font-bold text-slate-100">
            {key === "avgWT" || key === "avgTAT"
              ? result[key].toFixed(2)
              : result[key]}
          </p>
        </div>
      ))}
    </div>
  );
}
