import { useMemo, useState } from "react";

import { ALGORITHMS } from "./data/algorithms";
import { runAlgorithm } from "./utils/scheduler";
import AlgorithmResult from "./components/AlgorithmResult";

/* =========================================================
   ALGORITHM INFORMATION
========================================================= */

const ALGO_INFO = {
  fcfs: {
    badge: "Non-preemptive",
    color: "cyan",
    rule: "Execute the process that arrives first.",
    description:
      "Processes are executed in the same order as their arrival time. Once a process starts, it continues until completion.",
    complexity: "O(n log n)",
    bestFor: "Simple and predictable scheduling",
    advantage: "Easy to understand and implement",
    drawback: "Can cause long waiting time for short processes",
  },

  sjf: {
    badge: "Non-preemptive",
    color: "violet",
    rule: "Select the available process with the shortest burst time.",
    description:
      "Among all processes that have already arrived, the process with the smallest burst time is selected first.",
    complexity: "O(n²)",
    bestFor: "Reducing average waiting time",
    advantage: "Usually gives low average waiting time",
    drawback: "Long processes may suffer from starvation",
  },

  srtf: {
    badge: "Preemptive",
    color: "emerald",
    rule: "Run the process with the shortest remaining time.",
    description:
      "SRTF is the preemptive version of SJF. A newly arrived process can interrupt the currently running process if it has a shorter remaining time.",
    complexity: "O(n²)",
    bestFor: "Systems where short jobs should finish quickly",
    advantage: "Good average waiting and turnaround time",
    drawback: "More context switching can occur",
  },

  priority: {
    badge: "Non-preemptive",
    color: "amber",
    rule: "Select the available process with the highest priority.",
    description:
      "The scheduler selects the available process with the highest priority. In this implementation, a smaller priority number means higher priority.",
    complexity: "O(n²)",
    bestFor: "Priority-based task scheduling",
    advantage: "Important processes can be executed earlier",
    drawback: "Low-priority processes may starve",
  },

  rr: {
    badge: "Preemptive",
    color: "rose",
    rule: "Give each ready process a fixed time quantum in rotation.",
    description:
      "Round Robin gives every ready process a fixed amount of CPU time. After its quantum expires, the process goes back to the ready queue if it is not finished.",
    complexity: "O(n)",
    bestFor: "Interactive and time-sharing systems",
    advantage: "Fair CPU sharing among processes",
    drawback: "Small quantum can cause many context switches",
  },
};

/* =========================================================
   DEFAULT PROCESSES
========================================================= */

function makeDefaultProcesses(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: `P${i + 1}`,
    order: i,
    at: i === 0 ? 0 : i,
    bt: 4 + (i % 3) * 2,
    priority: i + 1,
  }));
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({ label, value, hint, icon }) {
  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900/75 p-4 transition hover:-translate-y-0.5 hover:border-cyan-400/30">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-slate-500">{label}</p>

        <span className="text-sm text-slate-600 transition group-hover:text-cyan-300">
          {icon}
        </span>
      </div>

      <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-600">{hint}</p>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ mode }) {
  return (
    <div className="flex min-h-[570px] items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/25 p-8 text-center">
      <div className="max-w-lg">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-400/5 text-3xl shadow-[0_0_50px_rgba(34,211,238,0.08)]">
          ◉
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
          {mode === "single"
            ? "Single Simulation"
            : "Comparative Analysis"}
        </p>

        <h2 className="mt-2 text-2xl font-bold text-white">
          CPU is ready
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
          Configure the process queue, choose your scheduling algorithm,
          and start the simulation to visualize CPU execution and
          performance metrics.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {[
            "Gantt Chart",
            "CT / TAT / WT",
            "Average Metrics",
            "CPU Idle",
          ].map((x) => (
            <span
              key={x}
              className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-500"
            >
              {x}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SINGLE ALGORITHM GUIDE CARD
========================================================= */

function AlgorithmInfo({ algoId }) {
  const info = ALGO_INFO[algoId];

  const algo = ALGORITHMS.find((a) => a.id === algoId);

  if (!info || !algo) return null;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
            How it works
          </p>

          <h3 className="mt-1 text-lg font-bold text-white">
            {algo.name}
          </h3>

          <p className="mt-1 text-xs text-slate-600">
            CPU Scheduling Algorithm
          </p>
        </div>

        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-[10px] font-semibold text-cyan-300">
          {info.badge}
        </span>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm leading-6 text-slate-400">
        {info.description}
      </p>

      {/* Rule + Complexity */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Scheduling Rule
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-300">
            {info.rule}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Complexity
          </p>

          <p className="mt-2 font-mono text-sm font-bold text-violet-300">
            {info.complexity}
          </p>
        </div>
      </div>

      {/* Extra information */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Best For
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            {info.bestFor}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Advantage
          </p>

          <p className="mt-2 text-xs leading-5 text-emerald-300">
            {info.advantage}
          </p>
        </div>
      </div>

      {/* Drawback */}
      <div className="mt-3 rounded-xl border border-rose-400/10 bg-rose-400/[0.03] p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
          Limitation
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-400">
          {info.drawback}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   COMPLETE ALGORITHM GUIDE
========================================================= */

function AlgorithmGuide({ mode, singleAlgo, compareAlgos }) {
  const algorithmIds =
    mode === "single"
      ? [singleAlgo]
      : compareAlgos;

  if (!algorithmIds.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-center">
        <p className="text-sm text-slate-500">
          Select at least one algorithm to view its guide.
        </p>
      </div>
    );
  }

  return (
    <section className="mb-6 rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.05] via-slate-900/70 to-violet-500/[0.04] p-5 shadow-xl shadow-black/10">
      {/* Guide Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">
            Algorithm Guide
          </p>

          <h2 className="mt-1 text-xl font-bold text-white">
            Scheduling Algorithms
          </h2>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
            Understand the scheduling rule, execution type, complexity,
            advantages and limitations of the selected algorithms.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-[10px] text-slate-500">
          {algorithmIds.length}{" "}
          {algorithmIds.length === 1
            ? "algorithm selected"
            : "algorithms selected"}
        </div>
      </div>

      {/* Guide Cards */}
      <div
        className={
          algorithmIds.length === 1
            ? "grid gap-4"
            : "grid gap-4 xl:grid-cols-2"
        }
      >
        {algorithmIds.map((id) => (
          <AlgorithmInfo key={id} algoId={id} />
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  const [mode, setMode] = useState("single");

  const [count, setCount] = useState(4);

  const [processes, setProcesses] = useState(
    makeDefaultProcesses(4)
  );

  const [singleAlgo, setSingleAlgo] = useState("fcfs");

  const [compareAlgos, setCompareAlgos] = useState([
    "fcfs",
    "sjf",
  ]);

  const [quantum, setQuantum] = useState(2);

  const [singleResult, setSingleResult] = useState(null);

  const [compareResults, setCompareResults] = useState(null);

  const [error, setError] = useState("");

  /* IMPORTANT:
     false = Guide hidden initially
  */
  const [showInfo, setShowInfo] = useState(false);

  const activeAlgoIds =
    mode === "single"
      ? [singleAlgo]
      : compareAlgos;

  const needsPriority = activeAlgoIds.some(
    (id) =>
      ALGORITHMS.find((a) => a.id === id)?.needsPriority
  );

  const needsQuantum = activeAlgoIds.some(
    (id) =>
      ALGORITHMS.find((a) => a.id === id)?.needsQuantum
  );

  const processOrder = useMemo(
    () => processes.map((p) => p.id),
    [processes]
  );

  /* =========================================================
     PROCESS COUNT
  ========================================================= */

  function handleCountChange(value) {
    const num = Math.max(
      1,
      Math.min(12, Number(value) || 1)
    );

    setCount(num);

    setProcesses((prev) =>
      Array.from({ length: num }, (_, i) => ({
        ...(prev[i] || {
          id: `P${i + 1}`,
          order: i,
          at: i,
          bt: 4,
          priority: i + 1,
        }),

        id: `P${i + 1}`,
        order: i,
      }))
    );

    /* Clear old results when input size changes */
    setSingleResult(null);
    setCompareResults(null);
    setError("");
  }

  /* =========================================================
     UPDATE PROCESS
  ========================================================= */

  function updateProcess(index, field, value) {
    setProcesses((prev) => {
      const next = [...prev];

      next[index] = {
        ...next[index],
        [field]: Number(value),
      };

      return next;
    });

    /* Clear old results after input change */
    setSingleResult(null);
    setCompareResults(null);
  }

  /* =========================================================
     TOGGLE COMPARE ALGORITHM
  ========================================================= */

  function toggleCompareAlgo(id) {
    setCompareAlgos((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );

    setCompareResults(null);
    setError("");
  }

  /* =========================================================
     CHANGE MODE
  ========================================================= */

  function changeMode(nextMode) {
    setMode(nextMode);

    setError("");

    /* Keep guide state unchanged.
       Therefore Show/Hide remains consistent. */

    if (nextMode === "single") {
      setCompareResults(null);
    } else {
      setSingleResult(null);
    }
  }

  /* =========================================================
     RUN SIMULATION
  ========================================================= */

  function handleRun() {
    setError("");

    /* Validate process data */
    for (const p of processes) {
      if (p.at < 0 || p.bt < 1) {
        setError(
          "Arrival time must be 0 or more, and burst time must be at least 1."
        );
        return;
      }

      if (needsPriority && p.priority < 1) {
        setError("Priority must be at least 1.");
        return;
      }
    }

    /* Validate Round Robin quantum */
    if (needsQuantum && quantum < 1) {
      setError("Time quantum must be at least 1.");
      return;
    }

    /* SINGLE MODE */
    if (mode === "single") {
      const result = runAlgorithm(
        singleAlgo,
        processes,
        quantum
      );

      setSingleResult(result);
      setCompareResults(null);

      return;
    }

    /* COMPARE MODE */
    if (compareAlgos.length < 2) {
      setError(
        "Select at least two algorithms to compare."
      );
      return;
    }

    const results = compareAlgos.map((id) => ({
      id,

      name:
        ALGORITHMS.find((a) => a.id === id)?.name ||
        id,

      result: runAlgorithm(
        id,
        processes,
        quantum
      ),
    }));

    setCompareResults(results);
    setSingleResult(null);
  }

  const selectedSingle = ALGORITHMS.find(
    (a) => a.id === singleAlgo
  );

  const bestWT = compareResults
    ? Math.min(
        ...compareResults.map(
          (r) => r.result.avgWT
        )
      )
    : null;

  const bestTAT = compareResults
    ? Math.min(
        ...compareResults.map(
          (r) => r.result.avgTAT
        )
      )
    : null;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#020617] text-slate-100">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.10),transparent_28%),radial-gradient(circle_at_10%_15%,rgba(139,92,246,0.08),transparent_24%)]" />

      <main className="relative mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="mb-6 border-b border-slate-800/80 pb-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            {/* Logo + Title */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/5 shadow-[0_0_40px_rgba(34,211,238,0.08)]">

                <svg
                  viewBox="0 0 128 128"
                  className="h-9 w-9 text-cyan-300"
                  fill="none"
                >
                  <rect
                    x="30"
                    y="30"
                    width="68"
                    height="68"
                    rx="10"
                    stroke="currentColor"
                    strokeWidth="7"
                  />

                  <rect
                    x="45"
                    y="45"
                    width="38"
                    height="38"
                    rx="5"
                    stroke="currentColor"
                    strokeWidth="6"
                  />

                  <path
                    d="M50 10v20M64 10v20M78 10v20M50 98v20M64 98v20M78 98v20M10 50h20M10 64h20M10 78h20M98 50h20M98 64h20M98 78h20"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />

                  <path
                    d="M56 56h16v16H56z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                    CPU Scheduler
                  </h1>

                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-emerald-300">
                    System Ready
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Interactive operating systems scheduling laboratory
                </p>
              </div>
            </div>

            {/* Header Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2.5">
                <p className="font-mono text-sm font-bold text-slate-200">
                  {count}
                </p>

                <p className="text-[9px] uppercase tracking-wider text-slate-600">
                  Processes
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2.5">
                <p className="font-mono text-sm font-bold text-slate-200">
                  5
                </p>

                <p className="text-[9px] uppercase tracking-wider text-slate-600">
                  Algorithms
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2.5">
                <p className="font-mono text-sm font-bold text-cyan-300">
                  LIVE
                </p>

                <p className="text-[9px] uppercase tracking-wider text-slate-600">
                  Simulator
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* =====================================================
            MODE + GUIDE BUTTON
        ===================================================== */}

        <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_auto]">

          <div className="flex rounded-2xl border border-slate-800 bg-slate-900/60 p-1">

            <button
              onClick={() => changeMode("single")}
              className={`flex-1 rounded-xl px-4 py-3 text-xs font-bold transition ${
                mode === "single"
                  ? "bg-white text-slate-950 shadow-lg"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              01 · Algorithm Visualization
            </button>

            <button
              onClick={() => changeMode("compare")}
              className={`flex-1 rounded-xl px-4 py-3 text-xs font-bold transition ${
                mode === "compare"
                  ? "bg-white text-slate-950 shadow-lg"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              02 · Comparative Analysis
            </button>
          </div>

          {/* FIXED SHOW/HIDE BUTTON */}

          <button
            type="button"
            onClick={() =>
              setShowInfo((previous) => !previous)
            }
            aria-expanded={showInfo}
            aria-controls="algorithm-guide"
            className={`rounded-2xl border px-5 py-3 text-xs font-semibold transition ${
              showInfo
                ? "border-cyan-400/30 bg-cyan-400/5 text-cyan-300"
                : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-cyan-400/30 hover:text-cyan-300"
            }`}
          >
            {showInfo
              ? "Hide Algorithm Guide"
              : "Show Algorithm Guide"}
          </button>
        </div>

        {/* =====================================================
            GLOBAL ALGORITHM GUIDE
            IMPORTANT FIX:
            NO mode === "single" restriction
        ===================================================== */}

        {showInfo && (
          <div id="algorithm-guide">
            <AlgorithmGuide
              mode={mode}
              singleAlgo={singleAlgo}
              compareAlgos={compareAlgos}
            />
          </div>
        )}

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <div className="grid gap-6 xl:grid-cols-[390px_1fr]">

          {/* ===================================================
              CONTROL PANEL
          =================================================== */}

          <aside className="h-fit rounded-3xl border border-slate-800 bg-slate-900/65 p-5 shadow-2xl shadow-black/20 xl:sticky xl:top-5">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Control Panel
                </p>

                <h2 className="mt-1 text-lg font-bold text-white">
                  Simulation Setup
                </h2>
              </div>

              <span className="rounded-lg bg-slate-950 px-2 py-1 font-mono text-[9px] text-slate-600">
                INPUT
              </span>
            </div>

            {/* Process Count */}
            <label className="mb-4 block">
              <span className="mb-2 flex justify-between text-xs font-medium text-slate-400">
                <span>Number of processes</span>

                <span className="font-mono text-slate-600">
                  1–12
                </span>
              </span>

              <input
                type="number"
                min="1"
                max="12"
                value={count}
                onChange={(e) =>
                  handleCountChange(e.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-sm outline-none focus:border-cyan-400"
              />
            </label>

            {/* Process Queue */}
            <div className="mb-5 overflow-hidden rounded-2xl border border-slate-800">
              <div className="border-b border-slate-800 bg-slate-950/70 px-3 py-2 text-[10px] uppercase tracking-wider text-slate-600">
                Process Queue
              </div>

              <div className="max-h-[320px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-slate-950 text-left text-slate-500">
                    <tr>
                      <th className="px-3 py-2.5">
                        ID
                      </th>

                      <th className="px-2 py-2.5">
                        AT
                      </th>

                      <th className="px-2 py-2.5">
                        BT
                      </th>

                      {needsPriority && (
                        <th className="px-2 py-2.5">
                          PRI
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {processes.map((p, i) => (
                      <tr key={p.id}>
                        <td className="px-3 py-2 font-mono font-bold text-cyan-300">
                          {p.id}
                        </td>

                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min="0"
                            value={p.at}
                            onChange={(e) =>
                              updateProcess(
                                i,
                                "at",
                                e.target.value
                              )
                            }
                            className="w-14 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 font-mono outline-none focus:border-cyan-400"
                          />
                        </td>

                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min="1"
                            value={p.bt}
                            onChange={(e) =>
                              updateProcess(
                                i,
                                "bt",
                                e.target.value
                              )
                            }
                            className="w-14 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 font-mono outline-none focus:border-cyan-400"
                          />
                        </td>

                        {needsPriority && (
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              min="1"
                              value={p.priority}
                              onChange={(e) =>
                                updateProcess(
                                  i,
                                  "priority",
                                  e.target.value
                                )
                              }
                              className="w-14 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 font-mono outline-none focus:border-cyan-400"
                            />
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SINGLE ALGORITHM */}
            {mode === "single" ? (
              <label className="mb-4 block">
                <span className="mb-2 block text-xs font-medium text-slate-400">
                  Scheduling algorithm
                </span>

                <select
                  value={singleAlgo}
                  onChange={(e) => {
                    setSingleAlgo(e.target.value);
                    setSingleResult(null);
                    setError("");
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-cyan-400"
                >
                  {ALGORITHMS.map((algo) => (
                    <option
                      key={algo.id}
                      value={algo.id}
                    >
                      {algo.shortName} — {algo.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              /* COMPARE ALGORITHMS */
              <div className="mb-4">
                <span className="mb-2 block text-xs font-medium text-slate-400">
                  Algorithms to compare
                </span>

                <div className="grid gap-2">
                  {ALGORITHMS.map((algo) => (
                    <label
                      key={algo.id}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 transition ${
                        compareAlgos.includes(algo.id)
                          ? "border-cyan-400/30 bg-cyan-400/5"
                          : "border-slate-800 bg-slate-950/50"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={compareAlgos.includes(
                            algo.id
                          )}
                          onChange={() =>
                            toggleCompareAlgo(algo.id)
                          }
                          className="h-4 w-4 accent-cyan-400"
                        />

                        <span className="text-xs text-slate-300">
                          {algo.shortName}
                        </span>
                      </span>

                      <span className="text-[9px] text-slate-600">
                        {ALGO_INFO[algo.id]?.badge}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTUM */}
            {needsQuantum && (
              <label className="mb-4 block">
                <span className="mb-2 block text-xs font-medium text-slate-400">
                  Time quantum
                </span>

                <input
                  type="number"
                  min="1"
                  value={quantum}
                  onChange={(e) => {
                    setQuantum(
                      Number(e.target.value) || 1
                    );
                    setSingleResult(null);
                    setCompareResults(null);
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-sm outline-none focus:border-cyan-400"
                />
              </label>
            )}

            {/* RUN */}
            <button
              type="button"
              onClick={handleRun}
              className="group flex w-full items-center justify-between rounded-xl bg-cyan-400 px-4 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              <span>Run Simulation</span>

              <span className="transition group-hover:translate-x-1">
                →
              </span>
            </button>

            {/* ERROR */}
            {error && (
              <div className="mt-3 rounded-xl border border-rose-400/20 bg-rose-400/5 px-3 py-2 text-xs leading-5 text-rose-300">
                {error}
              </div>
            )}
          </aside>

          {/* ===================================================
              RESULTS
          =================================================== */}

          <section className="min-w-0">

            {/* SINGLE METRICS */}
            {singleResult && (
              <div className="mb-5 grid gap-3 md:grid-cols-3">
                <MetricCard
                  label="Average Waiting"
                  value={singleResult.avgWT.toFixed(2)}
                  hint="Lower is better"
                  icon="WT"
                />

                <MetricCard
                  label="Average Turnaround"
                  value={singleResult.avgTAT.toFixed(2)}
                  hint="Lower is better"
                  icon="TAT"
                />

                <MetricCard
                  label="CPU Idle Time"
                  value={singleResult.idleTime}
                  hint={`Total: ${singleResult.totalTime} units`}
                  icon="CPU"
                />
              </div>
            )}

            {/* EMPTY */}
            {!singleResult &&
              !compareResults && (
                <EmptyState mode={mode} />
              )}

            {/* SINGLE RESULT */}
            {singleResult && selectedSingle && (
              <AlgorithmResult
                title={selectedSingle.name}
                result={singleResult}
                order={processOrder}
                showPriority={
                  selectedSingle.needsPriority
                }
              />
            )}

            {/* COMPARE RESULT */}
            {compareResults && (
              <>
                <div className="mb-5 grid gap-3 md:grid-cols-2">
                  <MetricCard
                    label="Best Average Waiting"
                    value={bestWT.toFixed(2)}
                    hint="Across selected algorithms"
                    icon="WT"
                  />

                  <MetricCard
                    label="Best Average Turnaround"
                    value={bestTAT.toFixed(2)}
                    hint="Across selected algorithms"
                    icon="TAT"
                  />
                </div>

                {/* Individual Results */}
                {compareResults.map((item) => {
                  const algorithm = ALGORITHMS.find(
                    (a) => a.id === item.id
                  );

                  return (
                    <AlgorithmResult
                      key={item.id}
                      title={item.name}
                      result={item.result}
                      order={processOrder}
                      showPriority={
                        algorithm?.needsPriority
                      }
                    />
                  );
                })}

                {/* Comparative Summary */}
                <section className="rounded-3xl border border-slate-800 bg-slate-900/65 p-5 shadow-xl shadow-black/10">
                  <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300">
                        Performance
                      </p>

                      <h3 className="mt-1 text-lg font-bold">
                        Comparative Summary
                      </h3>
                    </div>

                    <span className="text-[10px] text-slate-600">
                      {compareResults.length} algorithms selected
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-800">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-slate-950 text-[10px] uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-4 py-3">
                            Algorithm
                          </th>

                          <th className="px-4 py-3">
                            Avg WT
                          </th>

                          <th className="px-4 py-3">
                            Avg TAT
                          </th>

                          <th className="px-4 py-3">
                            Idle
                          </th>

                          <th className="px-4 py-3">
                            Total
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-800">
                        {compareResults.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-950/50"
                          >
                            <td className="px-4 py-3 font-semibold text-cyan-300">
                              {item.name}
                            </td>

                            <td
                              className={`px-4 py-3 font-mono ${
                                item.result.avgWT ===
                                bestWT
                                  ? "text-emerald-300"
                                  : "text-slate-300"
                              }`}
                            >
                              {item.result.avgWT.toFixed(
                                2
                              )}

                              {item.result.avgWT ===
                                bestWT && (
                                <span className="ml-1 text-[9px] uppercase">
                                  best
                                </span>
                              )}
                            </td>

                            <td
                              className={`px-4 py-3 font-mono ${
                                item.result.avgTAT ===
                                bestTAT
                                  ? "text-emerald-300"
                                  : "text-slate-300"
                              }`}
                            >
                              {item.result.avgTAT.toFixed(
                                2
                              )}

                              {item.result.avgTAT ===
                                bestTAT && (
                                <span className="ml-1 text-[9px] uppercase">
                                  best
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-3 font-mono text-slate-400">
                              {item.result.idleTime}
                            </td>

                            <td className="px-4 py-3 font-mono text-slate-400">
                              {item.result.totalTime}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}