import { useMemo } from "react";
import { SimulationResult } from "@/types/process";
import { Layers } from "lucide-react";

interface GanttChartProps {
  result: SimulationResult | null;
}

interface GanttBlock {
  pid: number;
  startTime: number;
  endTime: number;
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

const PROCESS_GRADIENTS: Record<number, string> = {
  1: "from-process-1 to-process-1/70",
  2: "from-process-2 to-process-2/70",
  3: "from-process-3 to-process-3/70",
  4: "from-process-4 to-process-4/70",
  5: "from-process-5 to-process-5/70",
  6: "from-process-6 to-process-6/70",
  7: "from-process-7 to-process-7/70",
  8: "from-process-8 to-process-8/70",
};

export function GanttChart({ result }: GanttChartProps) {
  const ganttBlocks = useMemo(() => {
    if (!result) return [];

    const blocks: GanttBlock[] = [];
    let currentPid = -1;
    let startTime = 0;

    result.timeline.forEach((pid, time) => {
      if (pid !== currentPid) {
        if (currentPid !== -1) {
          blocks.push({ pid: currentPid, startTime, endTime: time });
        }
        currentPid = pid;
        startTime = time;
      }
    });

    if (currentPid !== -1) {
      blocks.push({
        pid: currentPid,
        startTime,
        endTime: result.timeline.length,
      });
    }

    return blocks;
  }, [result]);

  const getProcessIndex = (pid: number): number => {
    if (!result) return 0;
    const uniquePids = [...new Set(result.processes.map(p => p.pid))];
    return uniquePids.indexOf(pid) + 1;
  };

  if (!result) {
    return (
      <div className="glass-card p-6 animate-slide-up">
        <div className="flex items-center gap-3 border-b border-border/50 pb-4 mb-6">
          <div className="p-2 rounded-lg bg-primary/20">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Gantt Chart</h2>
        </div>
        <div className="flex items-center justify-center h-24 text-muted-foreground">
          Run a simulation to see the Gantt chart
        </div>
      </div>
    );
  }

  const totalTime = result.timeline.length;

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-center gap-3 border-b border-border/50 pb-4 mb-6">
        <div className="p-2 rounded-lg bg-primary/20">
          <Layers className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Gantt Chart</h2>
      </div>

      <div className="overflow-x-auto pb-4">
        {/* Gantt blocks */}
        <div className="flex h-16 min-w-max rounded-lg overflow-hidden border border-border/30">
          {ganttBlocks.map((block, index) => {
            const width = ((block.endTime - block.startTime) / totalTime) * 100;
            const processIndex = getProcessIndex(block.pid);

            return (
              <div
                key={index}
                className={`relative flex items-center justify-center transition-all duration-300 hover:brightness-110 ${
                  block.pid === -1
                    ? "bg-muted/30"
                    : `bg-gradient-to-b ${PROCESS_GRADIENTS[processIndex] || "from-muted to-muted/70"}`
                }`}
                style={{ width: `${width}%`, minWidth: "40px" }}
              >
                <span
                  className={`font-mono text-sm font-bold ${
                    block.pid === -1 ? "text-muted-foreground" : "text-background"
                  }`}
                >
                  {block.pid === -1 ? "Idle" : `P${block.pid}`}
                </span>
              </div>
            );
          })}
        </div>

        {/* Time markers */}
        <div className="flex min-w-max mt-2">
          {ganttBlocks.map((block, index) => {
            const width = ((block.endTime - block.startTime) / totalTime) * 100;
            return (
              <div
                key={index}
                className="relative"
                style={{ width: `${width}%`, minWidth: "40px" }}
              >
                <span className="absolute left-0 text-xs font-mono text-muted-foreground -translate-x-1/2">
                  {block.startTime}
                </span>
                {index === ganttBlocks.length - 1 && (
                  <span className="absolute right-0 text-xs font-mono text-muted-foreground translate-x-1/2">
                    {block.endTime}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
