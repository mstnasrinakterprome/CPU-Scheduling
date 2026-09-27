export default function ResultTable({ table, showPriority }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700/60">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-4 py-3">Process</th>
            <th className="px-4 py-3">Arrival</th>
            <th className="px-4 py-3">Burst</th>
            {showPriority && <th className="px-4 py-3">Priority</th>}
            <th className="px-4 py-3">Completion</th>
            <th className="px-4 py-3">Turnaround</th>
            <th className="px-4 py-3">Waiting</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {table.map((row) => (
            <tr key={row.id} className="transition hover:bg-slate-900/60">
              <td className="px-4 py-3 font-mono font-bold text-cyan-300">{row.id}</td>
              <td className="px-4 py-3 font-mono">{row.at}</td>
              <td className="px-4 py-3 font-mono">{row.bt}</td>
              {showPriority && <td className="px-4 py-3 font-mono">{row.priority}</td>}
              <td className="px-4 py-3 font-mono">{row.ct}</td>
              <td className="px-4 py-3 font-mono">{row.tat}</td>
              <td className="px-4 py-3 font-mono">{row.wt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
