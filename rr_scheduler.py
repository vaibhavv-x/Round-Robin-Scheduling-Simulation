import random
from dataclasses import dataclass, field
from typing import List, Optional, Tuple


# -----------------------------
# Data structure for a Process
# -----------------------------
@dataclass
class Process:
    pid: int                    # Process ID
    arrival_time: int           # Time at which process arrives
    burst_time: int             # Original CPU burst time
    remaining_time: int = field(init=False)  # Remaining burst time
    start_time: Optional[int] = None         # First time it gets CPU
    completion_time: Optional[int] = None    # When it finishes

    def __post_init__(self):
        self.remaining_time = self.burst_time

    @property
    def turnaround_time(self) -> Optional[int]:
        if self.completion_time is None:
            return None
        return self.completion_time - self.arrival_time

    @property
    def waiting_time(self) -> Optional[int]:
        if self.turnaround_time is None:
            return None
        return self.turnaround_time - self.burst_time


# ---------------------------------
# Round Robin Scheduling Simulator
# ---------------------------------
def round_robin_simulation(
    processes: List[Process],
    time_quantum: int = 3,
    max_simulation_time: int = 50
) -> Tuple[List[Tuple[int, Optional[int]]], List[Process]]:
    """
    Simulate Round Robin scheduling.
    Returns:
        timeline: list of (time_unit, pid) where pid=None if CPU is idle
        completed: list of processes that finished within max_simulation_time
    """
    time = 0
    ready_queue: List[Process] = []
    timeline: List[Tuple[int, Optional[int]]] = []

    # Sort processes by arrival time
    processes = sorted(processes, key=lambda p: p.arrival_time)
    not_arrived = processes.copy()
    current: Optional[Process] = None
    quantum_counter = 0
    completed: List[Process] = []

    while time < max_simulation_time and (not_arrived or ready_queue or current):
        # Move newly arrived processes to ready queue
        newly_arrived = []
        for p in not_arrived:
            if p.arrival_time <= time:
                ready_queue.append(p)
                newly_arrived.append(p)
        for p in newly_arrived:
            not_arrived.remove(p)

        # If CPU is idle, pick next from ready queue
        if current is None and ready_queue:
            current = ready_queue.pop(0)
            if current.start_time is None:
                current.start_time = time
            quantum_counter = 0

        if current is not None:
            # Execute current process for 1 time unit
            timeline.append((time, current.pid))
            current.remaining_time -= 1
            quantum_counter += 1
            time += 1

            # Check if process completed
            if current.remaining_time == 0:
                current.completion_time = time
                completed.append(current)
                current = None
                quantum_counter = 0
            # Time quantum expired, preempt
            elif quantum_counter == time_quantum:
                ready_queue.append(current)
                current = None
                quantum_counter = 0
        else:
            # CPU idle this unit
            timeline.append((time, None))
            time += 1

    return timeline, completed


# --------------------------------
# Helper functions for I/O & stats
# --------------------------------
def print_timeline(timeline: List[Tuple[int, Optional[int]]]) -> None:
    """
    Print a simple Gantt-chart-like timeline.
    """
    print("\n--- CPU Timeline (Gantt Style) ---")
    line = ""
    for t, pid in timeline:
        slot = f"P{pid}" if pid is not None else "ID"
        line += f"|{slot:^3}"
    line += "|"
    print(line)

    # Print time markers under the timeline
    times = ""
    for t, _ in timeline:
        times += f"{t:4}"
    times += f"{timeline[-1][0] + 1:4}"
    print(times)
    print("----------------------------------\n")


def print_process_table(processes: List[Process]) -> None:
    """
    Print process details including waiting & turnaround times.
    """
    print("PID | Arrival | Burst | Completion | Turnaround | Waiting")
    print("----+---------+-------+-----------+-----------+--------")
    for p in processes:
        print(
            f"{p.pid:3d} |"
            f"{p.arrival_time:8d} |"
            f"{p.burst_time:5d} |"
            f"{(p.completion_time if p.completion_time is not None else -1):10d} |"
            f"{(p.turnaround_time if p.turnaround_time is not None else -1):10d} |"
            f"{(p.waiting_time if p.waiting_time is not None else -1):7d}"
        )


def compute_averages(processes: List[Process]) -> None:
    """
    Compute and print average waiting and turnaround time.
    Only completed processes are considered.
    """
    completed = [p for p in processes if p.completion_time is not None]
    if not completed:
        print("No process completed in given simulation time.")
        return

    total_waiting = 0
    total_turnaround = 0
    count = len(completed)

    # Sum waiting and turnaround times
    for p in completed:
        # These are not None for completed processes
        total_waiting += p.waiting_time
        total_turnaround += p.turnaround_time

    avg_waiting = total_waiting / count
    avg_turnaround = total_turnaround / count

    print(f"\nNumber of completed processes : {count}")
    print(f"Average Waiting Time          : {avg_waiting:.2f}")
    print(f"Average Turnaround Time       : {avg_turnaround:.2f}\n")


# ------------------
# Process Generators
# ------------------
def create_processes_fixed() -> List[Process]:
    """
    User enters processes with fixed (manual) burst times and arrival times.
    """
    n = int(input("Enter number of processes: "))
    processes: List[Process] = []
    for i in range(1, n + 1):
        at = int(input(f"Enter arrival time for P{i}: "))
        bt = int(input(f"Enter burst time for P{i}: "))
        processes.append(Process(pid=i, arrival_time=at, burst_time=bt))
    return processes


def create_processes_random() -> List[Process]:
    """
    Create processes with random arrival and burst times.
    """
    n = int(input("Enter number of processes: "))
    max_arrival = int(input("Enter maximum arrival time (e.g., 10): "))
    min_burst = int(input("Enter minimum burst time (e.g., 1): "))
    max_burst = int(input("Enter maximum burst time (e.g., 10): "))

    processes: List[Process] = []
    for i in range(1, n + 1):
        at = random.randint(0, max_arrival)
        bt = random.randint(min_burst, max_burst)
        print(f"Generated P{i}: arrival={at}, burst={bt}")
        processes.append(Process(pid=i, arrival_time=at, burst_time=bt))
    return processes


# -------------
# Main Program
# -------------
def main():
    print("Round Robin Scheduling Simulator (Time Quantum = 3)")
    print("1. Fixed (manual) burst times")
    print("2. Random (variable) burst times")
    mode = int(input("Choose mode (1/2): "))

    if mode == 1:
        processes = create_processes_fixed()
    else:
        processes = create_processes_random()

    max_time = int(input("Enter total simulation time (e.g., 50): "))

    timeline, completed = round_robin_simulation(
        processes,
        time_quantum=3,
        max_simulation_time=max_time
    )

    print_timeline(timeline)
    print_process_table(completed)
    compute_averages(completed)


if __name__ == "__main__":
    main()