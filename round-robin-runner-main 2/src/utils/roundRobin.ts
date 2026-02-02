import { Process, SimulationResult, ProcessStats } from "@/types/process";

export function runRoundRobin(
  inputProcesses: Process[],
  timeQuantum: number,
  maxTime: number
): SimulationResult {
  const processes = inputProcesses.map(p => ({
    ...p,
    remainingTime: p.burstTime,
    startTime: -1,
    completionTime: -1,
    started: false,
  }));

  // Sort by arrival time
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

  const timeline: number[] = new Array(maxTime).fill(-1);
  const readyQueue: number[] = [];
  const arrived: boolean[] = new Array(processes.length).fill(false);

  let time = 0;
  let completedCount = 0;
  let current = -1;
  let quantumCounter = 0;

  while (time < maxTime && completedCount < processes.length) {
    // Add newly arrived processes to ready queue
    for (let i = 0; i < processes.length; i++) {
      if (!arrived[i] && processes[i].arrivalTime <= time) {
        readyQueue.push(i);
        arrived[i] = true;
      }
    }

    // Get next process if none is running
    if (current === -1 && readyQueue.length > 0) {
      current = readyQueue.shift()!;
      if (!processes[current].started) {
        processes[current].startTime = time;
        processes[current].started = true;
      }
      quantumCounter = 0;
    }

    // Record timeline
    timeline[time] = current !== -1 ? processes[current].pid : -1;

    // Execute current process
    if (current !== -1) {
      processes[current].remainingTime--;
      quantumCounter++;

      if (processes[current].remainingTime === 0) {
        processes[current].completionTime = time + 1;
        completedCount++;
        current = -1;
        quantumCounter = 0;
      } else if (quantumCounter === timeQuantum) {
        readyQueue.push(current);
        current = -1;
        quantumCounter = 0;
      }
    }

    time++;
  }

  // Calculate averages
  let totalWaiting = 0;
  let totalTurnaround = 0;
  let countCompleted = 0;

  for (const p of processes) {
    if (p.completionTime !== -1) {
      const tat = p.completionTime - p.arrivalTime;
      const wt = tat - p.burstTime;
      totalTurnaround += tat;
      totalWaiting += wt;
      countCompleted++;
    }
  }

  return {
    timeline,
    processes,
    avgWaitingTime: countCompleted > 0 ? totalWaiting / countCompleted : 0,
    avgTurnaroundTime: countCompleted > 0 ? totalTurnaround / countCompleted : 0,
    totalTime: time,
  };
}

export function getProcessStats(processes: Process[]): ProcessStats[] {
  return processes.map(p => {
    const turnaroundTime = p.completionTime !== -1 
      ? p.completionTime - p.arrivalTime 
      : -1;
    const waitingTime = turnaroundTime !== -1 
      ? turnaroundTime - p.burstTime 
      : -1;

    return {
      pid: p.pid,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      completionTime: p.completionTime,
      turnaroundTime,
      waitingTime,
    };
  });
}

export function generateRandomProcesses(
  count: number,
  maxArrival: number,
  minBurst: number,
  maxBurst: number
): Process[] {
  return Array.from({ length: count }, (_, i) => ({
    pid: i + 1,
    arrivalTime: Math.floor(Math.random() * (maxArrival + 1)),
    burstTime: minBurst + Math.floor(Math.random() * (maxBurst - minBurst + 1)),
    remainingTime: 0,
    startTime: -1,
    completionTime: -1,
    started: false,
  }));
}
