import { useState } from "react";
import { Process, SimulationResult } from "@/types/process";
import { runRoundRobin } from "@/utils/roundRobin";
import { ProcessInput } from "@/components/ProcessInput";
import { Timeline } from "@/components/Timeline";
import { StatsTable } from "@/components/StatsTable";
import { GanttChart } from "@/components/GanttChart";
import { RotateCcw, Github, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [timeQuantum, setTimeQuantum] = useState(3);
  const [maxTime, setMaxTime] = useState(30);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    setIsAnimating(false);

    setTimeout(() => {
      const simulationResult = runRoundRobin(
        processes.map(p => ({ ...p })),
        timeQuantum,
        maxTime
      );
      setResult(simulationResult);
      setIsSimulating(false);
      setIsAnimating(true);
    }, 300);
  };

  const handleReset = () => {
    setProcesses([]);
    setResult(null);
    setIsAnimating(false);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
                  <Cpu className="w-6 h-6 text-background" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    Round Robin Scheduler
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    CPU Scheduling Simulation
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-[400px_1fr] gap-6">
            {/* Left sidebar - Process Input */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ProcessInput
                processes={processes}
                setProcesses={setProcesses}
                timeQuantum={timeQuantum}
                setTimeQuantum={setTimeQuantum}
                maxTime={maxTime}
                setMaxTime={setMaxTime}
                onSimulate={handleSimulate}
                isSimulating={isSimulating}
              />
            </div>

            {/* Right content - Results */}
            <div className="space-y-6">
              <Timeline result={result} isAnimating={isAnimating} />
              <GanttChart result={result} />
              <StatsTable result={result} />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 bg-card/30 backdrop-blur-xl mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>
                Round Robin CPU Scheduling Algorithm Visualization
              </p>
              <p className="font-mono text-xs">
                Time Quantum: {timeQuantum} | Max Time: {maxTime}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
