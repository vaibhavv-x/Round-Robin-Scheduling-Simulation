import { SimulationResult, ProcessStats } from "@/types/process";
import { getProcessStats } from "@/utils/roundRobin";
import { BarChart3, TrendingUp, Clock, Zap } from "lucide-react";

interface StatsTableProps {
  result: SimulationResult | null;
}

const PROCESS_COLORS: Record<number, string> = {
  1: "bg-process-1",
  2: "bg-process-2",
  3: "bg-process-3",
  4: "bg-process-4",
  5: "bg-process-5",
  6: "bg-process-6",
  7: "bg-process-7",
  8: "bg-process-8",
};

export function StatsTable({ result }: StatsTableProps) {
  if (!result) {
    return (
      <div className="glass-card p-6 animate-slide-up">
        <div className="flex items-center gap-3 border-b border-border/50 pb-4 mb-6">
          <div className="p-2 rounded-lg bg-accent/20">
            <BarChart3 className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Statistics</h2>
        </div>
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          Run a simulation to see process statistics
        </div>
      </div>
    );
  }

  const stats = getProcessStats(result.processes);
  const getProcessIndex = (pid: number): number => {
    const uniquePids = [...new Set(result.processes.map(p => p.pid))];
    return uniquePids.indexOf(pid) + 1;
  };

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-center gap-3 border-b border-border/50 pb-4 mb-6">
        <div className="p-2 rounded-lg bg-accent/20">
          <BarChart3 className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Statistics</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">Avg Waiting</span>
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">
            {result.avgWaitingTime.toFixed(2)}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
          <div className="flex items-center gap-2 text-secondary mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">Avg Turnaround</span>
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">
            {result.avgTurnaroundTime.toFixed(2)}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
          <div className="flex items-center gap-2 text-accent mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-medium">CPU Utilization</span>
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">
            {(
              (result.timeline.filter(t => t !== -1).length / result.timeline.length) *
              100
            ).toFixed(1)}
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>
      </div>

      {/* Process Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-3 px-2 text-muted-foreground font-medium">Process</th>
              <th className="text-center py-3 px-2 text-muted-foreground font-medium">Arrival</th>
              <th className="text-center py-3 px-2 text-muted-foreground font-medium">Burst</th>
              <th className="text-center py-3 px-2 text-muted-foreground font-medium">Completion</th>
              <th className="text-center py-3 px-2 text-muted-foreground font-medium">Turnaround</th>
              <th className="text-center py-3 px-2 text-muted-foreground font-medium">Waiting</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat, index) => {
              const processIndex = getProcessIndex(stat.pid);
              return (
                <tr
                  key={stat.pid}
                  className="border-b border-border/20 hover:bg-muted/20 transition-colors animate-fade-in-delay"
                  style={{ "--delay": `${index * 50}ms` } as React.CSSProperties}
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${PROCESS_COLORS[processIndex] || "bg-muted"}`}
                      />
                      <span className="font-mono font-semibold">P{stat.pid}</span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-2 font-mono text-muted-foreground">
                    {stat.arrivalTime}
                  </td>
                  <td className="text-center py-3 px-2 font-mono text-muted-foreground">
                    {stat.burstTime}
                  </td>
                  <td className="text-center py-3 px-2 font-mono">
                    {stat.completionTime !== -1 ? (
                      <span className="text-accent">{stat.completionTime}</span>
                    ) : (
                      <span className="text-destructive">N/A</span>
                    )}
                  </td>
                  <td className="text-center py-3 px-2 font-mono">
                    {stat.turnaroundTime !== -1 ? (
                      <span className="text-secondary">{stat.turnaroundTime}</span>
                    ) : (
                      <span className="text-destructive">N/A</span>
                    )}
                  </td>
                  <td className="text-center py-3 px-2 font-mono">
                    {stat.waitingTime !== -1 ? (
                      <span className="text-primary">{stat.waitingTime}</span>
                    ) : (
                      <span className="text-destructive">N/A</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
