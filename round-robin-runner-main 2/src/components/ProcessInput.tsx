import { useState } from "react";
import { Process } from "@/types/process";
import { generateRandomProcesses } from "@/utils/roundRobin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Shuffle, Trash2, Cpu } from "lucide-react";

interface ProcessInputProps {
  processes: Process[];
  setProcesses: (processes: Process[]) => void;
  timeQuantum: number;
  setTimeQuantum: (quantum: number) => void;
  maxTime: number;
  setMaxTime: (time: number) => void;
  onSimulate: () => void;
  isSimulating: boolean;
}

const PROCESS_COLORS = [
  "bg-process-1",
  "bg-process-2",
  "bg-process-3",
  "bg-process-4",
  "bg-process-5",
  "bg-process-6",
  "bg-process-7",
  "bg-process-8",
];

export function ProcessInput({
  processes,
  setProcesses,
  timeQuantum,
  setTimeQuantum,
  maxTime,
  setMaxTime,
  onSimulate,
  isSimulating,
}: ProcessInputProps) {
  const [randomCount, setRandomCount] = useState(5);
  const [maxArrival, setMaxArrival] = useState(10);
  const [minBurst, setMinBurst] = useState(2);
  const [maxBurst, setMaxBurst] = useState(8);

  const addProcess = () => {
    const newPid = processes.length > 0 
      ? Math.max(...processes.map(p => p.pid)) + 1 
      : 1;
    setProcesses([
      ...processes,
      {
        pid: newPid,
        arrivalTime: 0,
        burstTime: 3,
        remainingTime: 3,
        startTime: -1,
        completionTime: -1,
        started: false,
      },
    ]);
  };

  const removeProcess = (pid: number) => {
    setProcesses(processes.filter(p => p.pid !== pid));
  };

  const updateProcess = (pid: number, field: keyof Process, value: number) => {
    setProcesses(
      processes.map(p =>
        p.pid === pid ? { ...p, [field]: value } : p
      )
    );
  };

  const generateRandom = () => {
    const newProcesses = generateRandomProcesses(
      randomCount,
      maxArrival,
      minBurst,
      maxBurst
    );
    setProcesses(newProcesses);
  };

  const getProcessColor = (index: number) => {
    return PROCESS_COLORS[index % PROCESS_COLORS.length];
  };

  return (
    <div className="glass-card p-6 space-y-6 animate-slide-up">
      <div className="flex items-center gap-3 border-b border-border/50 pb-4">
        <div className="p-2 rounded-lg bg-primary/20">
          <Cpu className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Process Configuration</h2>
      </div>

      {/* Simulation Parameters */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground text-sm">Time Quantum</Label>
          <Input
            type="number"
            min={1}
            value={timeQuantum}
            onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
            className="bg-muted/50 border-border/50 font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground text-sm">Max Simulation Time</Label>
          <Input
            type="number"
            min={1}
            value={maxTime}
            onChange={(e) => setMaxTime(parseInt(e.target.value) || 20)}
            className="bg-muted/50 border-border/50 font-mono"
          />
        </div>
      </div>

      {/* Random Generation */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border/30 space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Shuffle className="w-4 h-4" />
          Random Generation
        </h3>
        <div className="grid grid-cols-4 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Count</Label>
            <Input
              type="number"
              min={1}
              max={8}
              value={randomCount}
              onChange={(e) => setRandomCount(parseInt(e.target.value) || 1)}
              className="bg-muted/50 border-border/50 font-mono h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Max Arrival</Label>
            <Input
              type="number"
              min={0}
              value={maxArrival}
              onChange={(e) => setMaxArrival(parseInt(e.target.value) || 0)}
              className="bg-muted/50 border-border/50 font-mono h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Min Burst</Label>
            <Input
              type="number"
              min={1}
              value={minBurst}
              onChange={(e) => setMinBurst(parseInt(e.target.value) || 1)}
              className="bg-muted/50 border-border/50 font-mono h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Max Burst</Label>
            <Input
              type="number"
              min={minBurst}
              value={maxBurst}
              onChange={(e) => setMaxBurst(parseInt(e.target.value) || minBurst)}
              className="bg-muted/50 border-border/50 font-mono h-9 text-sm"
            />
          </div>
        </div>
        <Button onClick={generateRandom} variant="outline" size="sm" className="w-full">
          <Shuffle className="w-4 h-4" />
          Generate Random Processes
        </Button>
      </div>

      {/* Process List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Processes ({processes.length})</h3>
          <Button onClick={addProcess} variant="ghost" size="sm" disabled={processes.length >= 8}>
            <Plus className="w-4 h-4" />
            Add Process
          </Button>
        </div>

        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2">
          {processes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No processes added. Add manually or generate random processes.
            </div>
          ) : (
            processes.map((process, index) => (
              <div
                key={process.pid}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/30 hover:border-border/50 transition-colors animate-fade-in-delay"
                style={{ "--delay": `${index * 50}ms` } as React.CSSProperties}
              >
                <div className={`w-3 h-3 rounded-full ${getProcessColor(index)}`} />
                <span className="font-mono text-sm font-semibold text-foreground min-w-[40px]">
                  P{process.pid}
                </span>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground whitespace-nowrap">Arrival:</Label>
                    <Input
                      type="number"
                      min={0}
                      value={process.arrivalTime}
                      onChange={(e) =>
                        updateProcess(process.pid, "arrivalTime", parseInt(e.target.value) || 0)
                      }
                      className="bg-muted/50 border-border/50 font-mono h-8 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground whitespace-nowrap">Burst:</Label>
                    <Input
                      type="number"
                      min={1}
                      value={process.burstTime}
                      onChange={(e) =>
                        updateProcess(process.pid, "burstTime", parseInt(e.target.value) || 1)
                      }
                      className="bg-muted/50 border-border/50 font-mono h-8 text-sm"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => removeProcess(process.pid)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      <Button
        onClick={onSimulate}
        variant="glow"
        size="lg"
        className="w-full"
        disabled={processes.length === 0 || isSimulating}
      >
        {isSimulating ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Simulating...
          </>
        ) : (
          <>
            <Cpu className="w-5 h-5" />
            Run Simulation
          </>
        )}
      </Button>
    </div>
  );
}
