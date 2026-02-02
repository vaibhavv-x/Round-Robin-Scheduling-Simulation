export interface Process {
  pid: number;
  arrivalTime: number;
  burstTime: number;
  remainingTime: number;
  startTime: number;
  completionTime: number;
  started: boolean;
}

export interface SimulationResult {
  timeline: number[];
  processes: Process[];
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  totalTime: number;
}

export interface ProcessStats {
  pid: number;
  arrivalTime: number;
  burstTime: number;
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
}
