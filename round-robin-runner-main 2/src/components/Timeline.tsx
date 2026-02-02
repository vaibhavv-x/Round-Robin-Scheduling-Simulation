import { useEffect, useState } from "react";
import { SimulationResult } from "@/types/process";
import { Clock } from "lucide-react";

interface TimelineProps {
  result: SimulationResult | null;
  isAnimating: boolean;
}

const PROCESS_COLORS: Record<number, string> = {
  1: "bg-process-1 border-process-1",
  2: "bg-process-2 border-process-2",
  3: "bg-process-3 border-process-3",
  4: "bg-process-4 border-process-4",
  5: "bg-process-5 border-process-5",
  6: "bg-process-6 border-process-6",
  7: "bg-process-7 border-process-7",
  8: "bg-process-8 border-process-8",
};

const PROCESS_TEXT_COLORS: Record<number, string> = {
  1: "text-process-1",
  2: "text-process-2",
  3: "text-process-3",
  4: "text-process-4",
  5: "text-process-5",
  6: "text-process-6",
  7: "text-process-7",
  8: "text-process-8",
};

export function Timeline({ result, isAnimating }: TimelineProps) {
  const [currentTime, setCurrentTime] = useState(-1);

  useEffect(() => {
    if (!result || !isAnimating) {
      setCurrentTime(-1);
      return;
    }

    setCurrentTime(0);
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= result.timeline.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [result, isAnimating]);

  if (!result) {
    return (
      <div className="glass-card p-6 animate-slide-up">
        <div className="flex items-center gap-3 border-b border-border/50 pb-4 mb-6">
          <div className="p-2 rounded-lg bg-secondary/20">
            <Clock className="w-5 h-5 text-secondary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">CPU Timeline</h2>
        </div>
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          Run a simulation to see the CPU timeline
        </div>
      </div>
    );
  }

  const getProcessIndex = (pid: number): number => {
    const uniquePids = [...new Set(result.processes.map(p => p.pid))];
    return uniquePids.indexOf(pid) + 1;
  };

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-center gap-3 border-b border-border/50 pb-4 mb-6">
        <div className="p-2 rounded-lg bg-secondary/20">
          <Clock className="w-5 h-5 text-secondary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">CPU Timeline</h2>
        {isAnimating && currentTime >= 0 && (
          <span className="ml-auto font-mono text-sm text-muted-foreground">
            Time: <span className="text-primary font-bold">{currentTime}</span>
          </span>
        )}
      </div>

      <div className="overflow-x-auto pb-4">
        {/* Time header */}
        <div className="flex gap-1 mb-2 min-w-max">
          <div className="w-16 text-xs text-muted-foreground font-medium flex items-center">
            Time
          </div>
          {result.timeline.map((_, index) => (
            <div
              key={index}
              className={`timeline-cell text-xs font-mono ${
                isAnimating && index === currentTime
                  ? "text-primary font-bold"
                  : "text-muted-foreground"
              }`}
            >
              {index}
            </div>
          ))}
        </div>

        {/* CPU execution timeline */}
        <div className="flex gap-1 min-w-max">
          <div className="w-16 text-xs text-muted-foreground font-medium flex items-center">
            CPU
          </div>
          {result.timeline.map((pid, index) => {
            const processIndex = pid !== -1 ? getProcessIndex(pid) : 0;
            const isActive = isAnimating && index === currentTime;
            const isPast = isAnimating && index < currentTime;
            const shouldShow = !isAnimating || index <= currentTime;

            return (
              <div
                key={index}
                className={`timeline-cell border-2 ${
                  pid === -1
                    ? "bg-muted/30 border-border/30 text-muted-foreground"
                    : shouldShow
                    ? `${PROCESS_COLORS[processIndex] || "bg-muted"} border-transparent`
                    : "bg-muted/20 border-border/20"
                } ${isActive ? "animate-running ring-2 ring-foreground/50" : ""} ${
                  isPast ? "opacity-80" : ""
                }`}
                style={{
                  opacity: shouldShow ? 1 : 0.2,
                  transition: "all 0.3s ease-out",
                }}
              >
                {shouldShow && (pid === -1 ? "—" : `P${pid}`)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border/30">
        <h4 className="text-xs text-muted-foreground mb-3">Process Legend</h4>
        <div className="flex flex-wrap gap-3">
          {result.processes.map((process) => {
            const processIndex = getProcessIndex(process.pid);
            return (
              <div
                key={process.pid}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/30 border border-border/30"
              >
                <div
                  className={`w-3 h-3 rounded-full ${PROCESS_COLORS[processIndex]?.replace("border-", "bg-") || "bg-muted"}`}
                />
                <span className={`font-mono text-xs font-semibold ${PROCESS_TEXT_COLORS[processIndex] || ""}`}>
                  P{process.pid}
                </span>
                <span className="text-xs text-muted-foreground">
                  (Burst: {process.burstTime})
                </span>
              </div>
            );
          })}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/30 border border-border/30">
            <div className="w-3 h-3 rounded-full bg-muted/50" />
            <span className="font-mono text-xs text-muted-foreground">Idle</span>
          </div>
        </div>
      </div>
    </div>
  );
}
