export const ALGORITHMS = [
  { id: "fcfs", name: "First Come First Served", shortName: "FCFS", needsPriority: false, needsQuantum: false },
  { id: "sjf", name: "Shortest Job First (non-preemptive)", shortName: "SJF", needsPriority: false, needsQuantum: false },
  { id: "srtf", name: "Shortest Remaining Time First (preemptive)", shortName: "SRTF", needsPriority: false, needsQuantum: false },
  { id: "priority", name: "Priority (non-preemptive)", shortName: "Priority", needsPriority: true, needsQuantum: false },
  { id: "rr", name: "Round Robin", shortName: "RR", needsPriority: false, needsQuantum: true },
];

export const PROCESS_COLORS = [
  "#67e8f9", "#a78bfa", "#34d399", "#fbbf24",
  "#fb7185", "#60a5fa", "#f472b6", "#4ade80",
];

export function colorFor(id, order) {
  const index = order.indexOf(id);
  return PROCESS_COLORS[(index < 0 ? 0 : index) % PROCESS_COLORS.length];
}
