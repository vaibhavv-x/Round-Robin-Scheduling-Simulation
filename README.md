⚙️ Round Robin CPU Scheduler – Interactive Simulation

An interactive web-based visualization of the Round Robin CPU Scheduling Algorithm built using React + TypeScript + Vite + TailwindCSS + shadcn/ui.

This project allows users to add processes, configure time quantum, and watch how CPU scheduling works in real-time with animated visualization and performance metrics.

⸻

🚀 Live Simulation Features
	•	✅ Add custom processes (Arrival Time, Burst Time)
	•	✅ Set Time Quantum dynamically
	•	✅ Real-time scheduling animation
	•	✅ Gantt Chart timeline visualization
	•	✅ Automatic calculation of:
	•	Waiting Time
	•	Turnaround Time
	•	Completion Time
	•	✅ Responsive & clean UI
	•	✅ Interactive statistics display

⸻

🧠 What is Round Robin?

Round Robin is a preemptive CPU scheduling algorithm used in Operating Systems.
Each process gets a fixed time slice (Time Quantum).
If a process is not completed in its time slice, it goes back to the ready queue.

This simulation helps students visually understand how:
	•	Context switching works
	•	Time quantum affects performance
	•	Waiting time changes dynamically

Perfect for OS practicals and viva preparation.

⸻

🛠️ Tech Stack
	•	⚡ Vite
	•	⚛️ React 18
	•	🟦 TypeScript
	•	🎨 TailwindCSS
	•	🧩 shadcn/ui
	•	📊 Recharts (for visualization)
	•	🧠 React Hook Form + Zod (form validation)
	•	📦 Radix UI Components

⸻

📂 Project Structure
src/
 ├── components/
 ├── pages/
 ├── hooks/
 ├── lib/
 ├── main.tsx
 └── App.tsx


⸻

📊 How It Works (Algorithm Logic)
	1.	Processes are added to the ready queue.
	2.	CPU assigns each process a fixed time quantum.
	3.	If remaining burst time > time quantum:
	•	Process is preempted
	•	Remaining time is updated
	•	Process re-enters queue
	4.	If remaining burst time ≤ time quantum:
	•	Process completes
	5.	Metrics are calculated automatically.


⸻

🎯 Use Cases
	•	Operating Systems lab project
	•	Academic demonstration
	•	Interview preparation
	•	Algorithm visualization learning
	•	Understanding preemptive scheduling

⸻

🧑‍💻 Author

Vaibhav
BTech CSE Student | Full Stack Developer 🚀

⭐ If You Like This Project

Give it a ⭐ on GitHub
Fork it 🍴
Improve it 💡
Build more OS simulations 🔥
