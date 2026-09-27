# CPU Scheduling Visualizer

An interactive web-based **CPU Scheduling Algorithm Visualizer** built with **React, Vite, and Tailwind CSS**. The application helps users understand, visualize, and compare different CPU scheduling algorithms using process inputs, Gantt charts, scheduling metrics, and comparative analysis.

## 🚀 Live Demo

**Live Application:**  
https://cpuscheduling-os-seu.netlify.app/

---

## 📌 Project Overview

CPU scheduling is an important concept in Operating Systems where the CPU decides which process should be executed next.

This project provides an interactive environment to simulate and visualize commonly used CPU scheduling algorithms. Users can enter process information, select scheduling algorithms, generate Gantt charts, and analyze performance using metrics such as:

- Completion Time (CT)
- Turnaround Time (TAT)
- Waiting Time (WT)
- Average Waiting Time
- Average Turnaround Time
- Total CPU Idle Time

The application also provides a **Comparative Analysis** mode to compare multiple scheduling algorithms side by side.

---

## 🎯 Features

### 1. Algorithm Visualization

The application supports the following CPU scheduling algorithms:

- **First Come First Served (FCFS)**
- **Shortest Job First (SJF)**
- **Shortest Remaining Time First (SRTF)**
- **Priority Scheduling**
- **Round Robin (RR)**

### 2. Process Input

Users can configure:

- Number of processes
- Arrival Time (AT)
- Burst Time (BT)
- Priority
- Time Quantum for Round Robin

### 3. Gantt Chart

After running a simulation, the application generates a visual **Gantt Chart** showing the execution sequence of processes.

### 4. Scheduling Metrics

For every process, the application calculates:

| Metric | Description |
|---|---|
| Completion Time (CT) | Time when the process finishes execution |
| Turnaround Time (TAT) | Total time from arrival to completion |
| Waiting Time (WT) | Time spent waiting in the ready queue |

### 5. Performance Analysis

The application displays:

- Average Waiting Time
- Average Turnaround Time
- Total CPU Idle Time
- Total execution time

### 6. Comparative Analysis

Users can select multiple algorithms and compare their performance.

The comparative section highlights:

- Average Waiting Time
- Average Turnaround Time
- CPU Idle Time
- Total execution time
- Best-performing algorithm

### 7. Algorithm Guide

An integrated **Algorithm Guide** explains:

- Algorithm type
- Preemptive / Non-preemptive behavior
- Scheduling rule
- Time complexity
- Advantages
- Limitations
- How the algorithm works

### 8. Responsive UI

The application is designed with a modern dark-themed interface and responsive layouts for different screen sizes.

---

## 🧠 Supported Algorithms

### FCFS — First Come First Served

**Type:** Non-Preemptive

The process that arrives first is executed first.

**Advantage:** Simple and easy to implement.

**Limitation:** Long processes can cause high waiting time for shorter processes.

---

### SJF — Shortest Job First

**Type:** Non-Preemptive

Among the available processes, the process with the shortest burst time is selected.

**Advantage:** Usually provides a low average waiting time.

**Limitation:** Long processes may experience starvation.

---

### SRTF — Shortest Remaining Time First

**Type:** Preemptive

SRTF is the preemptive version of SJF. The process with the shortest remaining execution time is selected.

A newly arrived process can preempt the currently running process if it has a shorter remaining time.

**Advantage:** Can provide efficient waiting and turnaround times.

**Limitation:** May produce more context switching.

---

### Priority Scheduling

**Type:** Non-Preemptive

The available process with the highest priority is selected for execution.

In this implementation, a **smaller priority number represents a higher priority**.

**Advantage:** Important processes can be executed earlier.

**Limitation:** Low-priority processes may suffer from starvation.

---

### Round Robin

**Type:** Preemptive

Each ready process receives a fixed amount of CPU time called a **Time Quantum**.

If the process does not finish within its quantum, it returns to the ready queue.

**Advantage:** Provides fair CPU sharing.

**Limitation:** A very small time quantum can cause frequent context switching.

---

## 🖥️ Application Modules

### Module 1 — Algorithm Visualization

Users can:

1. Enter process information.
2. Select one scheduling algorithm.
3. Configure algorithm-specific parameters.
4. Run the simulation.
5. View the Gantt chart.
6. Analyze CT, TAT, and WT.
7. View average performance metrics.

### Module 2 — Comparative Analysis

Users can:

1. Enter process information.
2. Select two or more scheduling algorithms.
3. Run all selected algorithms.
4. View individual Gantt charts.
5. Compare average waiting time.
6. Compare average turnaround time.
7. Compare CPU idle time.
8. Identify the best-performing algorithm.

---

## 🛠️ Technologies Used

- **React.js**
- **Vite**
- **JavaScript (ES6+)**
- **Tailwind CSS**
- **PostCSS**
- **HTML5**
- **CSS3**

---

## 📂 Project Structure

```text
CPU-Scheduling/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── AlgorithmResult.jsx
│   │   ├── GanttChart.jsx
│   │   ├── ResultTable.jsx
│   │   └── StatCards.jsx
│   │
│   ├── data/
│   │   └── algorithms.js
│   │
│   ├── utils/
│   │   └── scheduler.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── netlify.toml
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/mstnasrinakterprome/CPU-Scheduling.git
```

### 2. Navigate to the project

```bash
cd CPU-Scheduling
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at the local Vite development URL.

---

## 🏗️ Production Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

The production files are generated inside:

```text
dist/
```

---

## 🌐 Deployment

This project is deployed using **Netlify**.

### Netlify Build Configuration

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

### Live Website

**CPU Scheduling Visualizer:**  
https://cpuscheduling-os-seu.netlify.app/

---

## 📊 Performance Metrics

The application uses the following standard scheduling formulas:

### Turnaround Time

```text
TAT = Completion Time - Arrival Time
```

### Waiting Time

```text
WT = Turnaround Time - Burst Time
```

### Average Waiting Time

```text
Average WT = Total Waiting Time / Number of Processes
```

### Average Turnaround Time

```text
Average TAT = Total Turnaround Time / Number of Processes
```

---

## 🎓 Educational Purpose

This project is designed as an educational tool for understanding **Operating Systems CPU Scheduling**.

It can help students:

- Understand scheduling algorithms
- Visualize process execution
- Practice Gantt chart construction
- Calculate scheduling metrics
- Compare algorithm performance
- Prepare for Operating Systems examinations and viva

---

## 🔮 Future Improvements

Possible future enhancements include:

- Animated Gantt chart execution
- Step-by-step scheduling visualization
- Context-switch counting
- CPU utilization calculation
- Response time calculation
- More scheduling algorithms
- Export results as PDF
- Export comparison results as CSV
- Interactive performance charts
- Process timeline animation

---

## 👨‍💻 Author

**Mst. Nasrin Akter Prome**

GitHub:  
https://github.com/mstnasrinakterprome

---

## ⭐ Project

If you find this project useful for learning CPU scheduling and Operating Systems concepts, consider giving the repository a ⭐ on GitHub.
