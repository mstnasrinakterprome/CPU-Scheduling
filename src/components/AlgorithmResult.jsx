import GanttChart from "./GanttChart";
import ResultTable from "./ResultTable";
import StatCards from "./StatCards";

export default function AlgorithmResult({
  title,
  result,
  order,
  showPriority,
}) {
  return (
    <section className="mb-5 rounded-2xl border border-slate-700/60 bg-slate-900/60 p-5 shadow-xl shadow-black/10">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-cyan-300">{title}</h3>
        <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[10px] uppercase tracking-wider text-slate-500">
          Gantt Chart
        </span>
      </div>

      <GanttChart segments={result.segments} order={order} />
      <ResultTable table={result.table} showPriority={showPriority} />
      <StatCards result={result} />
    </section>
  );
}
