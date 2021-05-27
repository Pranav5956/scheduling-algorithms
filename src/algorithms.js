// let formData = {
//   queueCount: 1,
//   algorithms: [
//     {
//       algorithm: "FCFS",
//       quantum: 0,
//     },
//   ],
//   arrivalTimes: [1, 5, 6, 7, 1, 15, 12],
//   burstTimes: [3, 6, 10, 1, 5, 2, 7],
//   priorities: [2, 1, 3, 4, 5, 2, 1],
// };

const createProcess = (formData) => {
  const arrivalTimes = formData.arrivalTimes;
  const burstTimes = formData.burstTimes;
  const priorities = formData.priorities;

  let n = arrivalTimes.length;
  let processes = [];
  for (let i = 0; i < n; i++) {
    let process = {
      PID: String.fromCharCode(65 + i),
      arrivalTime: arrivalTimes[i],
      burstTime: burstTimes[i],
      burstLeft: burstTimes[i],
      priority: priorities[i],
      completed: false,
    };
    processes.push(process);
  }
  return processes;
};

export const runAlgorithm = (formData) => {
  let processes = createProcess(formData);
  let metrics = {
    waitTime: processes.map(() => 0),
    turnAroundTime: processes.map(() => 0),
    completionTime: processes.map(() => 0),
    avgWaitTime: 0,
    avgTurnAroundTime: 0,
    avgServiceTime: 0,
  };

  if (formData.queueCount === 1)
    switch (formData.algorithms[0].algorithm) {
      case "FCFS":
        return FirstComeFirstServedScheduling(processes, metrics);
      case "SJF":
        return ShortestJobFirstScheduling(processes, metrics);
      case "SJRF":
        return ShortestJobRemainingFirstScheduling(processes, metrics);
      case "P":
        return PriorityScheduling(processes, metrics);
      case "PP":
        return PreEmptivePriorityScheduling(processes, metrics);
      case "RR":
        return RoundRobinScheduling(
          processes,
          metrics,
          formData.algorithms[0].quantum
        );
    }
};

const getAverage = (list) => {
  return list.reduce((sum, item) => sum + item) / list.length;
};

const checkIfAllProcessesCompleted = (processes) =>
  processes.filter((process) => !process.completed).length === 0;

const FirstComeFirstServedScheduling = (processes, metrics) => {
  let timer = 0,
    chart = [],
    completed = checkIfAllProcessesCompleted(processes),
    queue = [];

  while (!completed) {
    let newProcesses = processes.filter(
      (process) => !process.completed && process.arrivalTime === timer
    );

    if (newProcesses.length !== 0) queue = [...queue, ...newProcesses];

    if (queue.length === 0) {
      chart.push({ tick: timer, process: null });
    } else {
      queue[0].burstLeft -= 1;

      chart.push({
        tick: timer,
        process: {
          PID: queue[0].PID,
          arrivalTime: queue[0].arrivalTime,
          burstTime: queue[0].burstTime,
          burstLeft: queue[0].burstLeft,
        },
      });

      if (queue[0].burstLeft === 0) {
        let completedProcess = queue.shift();
        completedProcess = processes.findIndex(
          (process) => process.PID === completedProcess.PID
        );

        processes[completedProcess].completed = true;
        metrics.completionTime[completedProcess] = timer + 1;

        metrics.turnAroundTime[completedProcess] =
          metrics.completionTime[completedProcess] -
          processes[completedProcess].arrivalTime;

        metrics.waitTime[completedProcess] =
          metrics.turnAroundTime[completedProcess] -
          processes[completedProcess].burstTime;
      }
    }

    completed = checkIfAllProcessesCompleted(processes);
    timer += 1;
  }

  metrics.avgWaitTime = getAverage(metrics.waitTime);
  metrics.avgTurnAroundTime = getAverage(metrics.turnAroundTime);
  metrics.avgServiceTime = getAverage(
    processes.map((process) => process.burstTime)
  );

  console.log(chart);
  console.log(metrics);

  return { chart, metrics };
};

const ShortestJobFirstScheduling = (processes, metrics) => {
  let queue = [],
    completed = checkIfAllProcessesCompleted(processes),
    timer = 0,
    chart = [];

  while (!completed) {
    let newProcesses = processes
      .filter((process) => !process.completed && process.arrivalTime === timer)
      .sort((p1, p2) => p1.burstTime - p2.burstTime);

    if (newProcesses.length !== 0) {
      queue = [...queue, ...newProcesses];

      if (queue.length > 1) {
        queue = [
          queue[0],
          ...queue.slice(1).sort((p1, p2) => p1.burstTime - p2.burstTime),
        ];
      }
    }

    if (queue.length === 0) {
      chart.push({ tick: timer, process: null });
    } else {
      queue[0].burstLeft -= 1;

      chart.push({
        tick: timer,
        process: {
          PID: queue[0].PID,
          arrivalTime: queue[0].arrivalTime,
          burstTime: queue[0].burstTime,
          burstLeft: queue[0].burstLeft,
        },
      });

      if (queue[0].burstLeft === 0) {
        let completedProcess = queue.shift();
        completedProcess = processes.findIndex(
          (process) => process.PID === completedProcess.PID
        );

        processes[completedProcess].completed = true;
        metrics.completionTime[completedProcess] = timer + 1;

        metrics.turnAroundTime[completedProcess] =
          metrics.completionTime[completedProcess] -
          processes[completedProcess].arrivalTime;

        metrics.waitTime[completedProcess] =
          metrics.turnAroundTime[completedProcess] -
          processes[completedProcess].burstTime;
      }
    }

    completed = checkIfAllProcessesCompleted(processes);
    timer += 1;
  }

  metrics.avgWaitTime = getAverage(metrics.waitTime);
  metrics.avgTurnAroundTime = getAverage(metrics.turnAroundTime);
  metrics.avgServiceTime = getAverage(
    processes.map((process) => process.burstTime)
  );

  console.log(chart);
  console.log(metrics);

  return { chart, metrics };
};

const ShortestJobRemainingFirstScheduling = (processes, metrics) => {
  let queue = [],
    completed = checkIfAllProcessesCompleted(processes),
    timer = 0,
    chart = [];

  while (!completed) {
    let newProcesses = processes.filter(
      (process) => !process.completed && process.arrivalTime === timer
    );

    if (newProcesses.length !== 0) {
      queue = [...queue, ...newProcesses];
    }

    queue.sort((p1, p2) => p1.burstLeft - p2.burstLeft);

    if (queue.length === 0) {
      chart.push({ tick: timer, process: null });
    } else {
      queue[0].burstLeft -= 1;

      chart.push({
        tick: timer,
        process: {
          PID: queue[0].PID,
          arrivalTime: queue[0].arrivalTime,
          burstTime: queue[0].burstTime,
          burstLeft: queue[0].burstLeft,
        },
      });

      if (queue[0].burstLeft === 0) {
        let completedProcess = queue.shift();
        completedProcess = processes.findIndex(
          (process) => process.PID === completedProcess.PID
        );

        processes[completedProcess].completed = true;
        metrics.completionTime[completedProcess] = timer + 1;

        metrics.turnAroundTime[completedProcess] =
          metrics.completionTime[completedProcess] -
          processes[completedProcess].arrivalTime;

        metrics.waitTime[completedProcess] =
          metrics.turnAroundTime[completedProcess] -
          processes[completedProcess].burstTime;
      }
    }

    completed = checkIfAllProcessesCompleted(processes);
    timer += 1;
  }

  metrics.avgWaitTime = getAverage(metrics.waitTime);
  metrics.avgTurnAroundTime = getAverage(metrics.turnAroundTime);
  metrics.avgServiceTime = getAverage(
    processes.map((process) => process.burstTime)
  );

  console.log(chart);
  console.log(metrics);

  return { chart, metrics };
};

const PriorityScheduling = (processes, metrics) => {
  let queue = [],
    completed = checkIfAllProcessesCompleted(processes),
    timer = 0,
    chart = [];

  while (!completed) {
    let newProcesses = processes
      .filter((process) => !process.completed && process.arrivalTime === timer)
      .sort((p1, p2) => p1.priority - p2.priority);

    if (newProcesses.length !== 0) {
      queue = [...queue, ...newProcesses];

      if (queue.length > 1) {
        queue = [
          queue[0],
          ...queue.slice(1).sort((p1, p2) => p1.priority - p2.priority),
        ];
      }
    }

    if (queue.length === 0) {
      chart.push({ tick: timer, process: null });
    } else {
      queue[0].burstLeft -= 1;

      chart.push({
        tick: timer,
        process: {
          PID: queue[0].PID,
          arrivalTime: queue[0].arrivalTime,
          burstTime: queue[0].burstTime,
          burstLeft: queue[0].burstLeft,
        },
      });

      if (queue[0].burstLeft === 0) {
        let completedProcess = queue.shift();
        completedProcess = processes.findIndex(
          (process) => process.PID === completedProcess.PID
        );

        processes[completedProcess].completed = true;
        metrics.completionTime[completedProcess] = timer + 1;

        metrics.turnAroundTime[completedProcess] =
          metrics.completionTime[completedProcess] -
          processes[completedProcess].arrivalTime;

        metrics.waitTime[completedProcess] =
          metrics.turnAroundTime[completedProcess] -
          processes[completedProcess].burstTime;
      }
    }

    completed = checkIfAllProcessesCompleted(processes);
    timer += 1;
  }

  metrics.avgWaitTime = getAverage(metrics.waitTime);
  metrics.avgTurnAroundTime = getAverage(metrics.turnAroundTime);
  metrics.avgServiceTime = getAverage(
    processes.map((process) => process.burstTime)
  );

  console.log(chart);
  console.log(metrics);

  return { chart, metrics };
};

const PreEmptivePriorityScheduling = (processes, metrics) => {
  let queue = [],
    completed = checkIfAllProcessesCompleted(processes),
    timer = 0,
    chart = [];

  while (!completed) {
    let newProcesses = processes.filter(
      (process) => !process.completed && process.arrivalTime === timer
    );

    if (newProcesses.length !== 0) {
      queue = [...queue, ...newProcesses];
    }

    queue.sort((p1, p2) => p1.priority - p2.priority);

    if (queue.length === 0) {
      chart.push({ tick: timer, process: null });
    } else {
      queue[0].burstLeft -= 1;

      chart.push({
        tick: timer,
        process: {
          PID: queue[0].PID,
          arrivalTime: queue[0].arrivalTime,
          burstTime: queue[0].burstTime,
          burstLeft: queue[0].burstLeft,
        },
      });

      if (queue[0].burstLeft === 0) {
        let completedProcess = queue.shift();
        completedProcess = processes.findIndex(
          (process) => process.PID === completedProcess.PID
        );

        processes[completedProcess].completed = true;
        metrics.completionTime[completedProcess] = timer + 1;

        metrics.turnAroundTime[completedProcess] =
          metrics.completionTime[completedProcess] -
          processes[completedProcess].arrivalTime;

        metrics.waitTime[completedProcess] =
          metrics.turnAroundTime[completedProcess] -
          processes[completedProcess].burstTime;
      }
    }

    completed = checkIfAllProcessesCompleted(processes);
    timer += 1;
  }

  metrics.avgWaitTime = getAverage(metrics.waitTime);
  metrics.avgTurnAroundTime = getAverage(metrics.turnAroundTime);
  metrics.avgServiceTime = getAverage(
    processes.map((process) => process.burstTime)
  );

  console.log(chart);
  console.log(metrics);

  return { chart, metrics };
};

const RoundRobinScheduling = (processes, metrics, quantum) => {
  let timer = 0,
    chart = [],
    completed = checkIfAllProcessesCompleted(processes),
    queue = [],
    currentExecutionQuantum = 0,
    suspendedProcess = null;

  while (!completed) {
    let newProcesses = processes.filter(
      (process) => !process.completed && process.arrivalTime === timer
    );

    if (newProcesses.length !== 0) queue = [...queue, ...newProcesses];

    if (suspendedProcess) {
      queue.push(suspendedProcess);
      suspendedProcess = null;
    }

    if (queue.length === 0) {
      chart.push({ tick: timer, process: null });
    } else {
      queue[0].burstLeft -= 1;
      currentExecutionQuantum += 1;

      chart.push({
        tick: timer,
        process: {
          PID: queue[0].PID,
          arrivalTime: queue[0].arrivalTime,
          burstTime: queue[0].burstTime,
          burstLeft: queue[0].burstLeft,
        },
      });

      if (queue[0].burstLeft === 0) {
        let completedProcess = queue.shift();
        completedProcess = processes.findIndex(
          (process) => process.PID === completedProcess.PID
        );
        currentExecutionQuantum = 0;

        processes[completedProcess].completed = true;
        metrics.completionTime[completedProcess] = timer + 1;

        metrics.turnAroundTime[completedProcess] =
          metrics.completionTime[completedProcess] -
          processes[completedProcess].arrivalTime;

        metrics.waitTime[completedProcess] =
          metrics.turnAroundTime[completedProcess] -
          processes[completedProcess].burstTime;
      }

      if (currentExecutionQuantum === quantum) {
        currentExecutionQuantum = 0;
        suspendedProcess = queue.shift();
      }
    }

    completed = checkIfAllProcessesCompleted(processes);
    timer += 1;
  }

  metrics.avgWaitTime = getAverage(metrics.waitTime);
  metrics.avgTurnAroundTime = getAverage(metrics.turnAroundTime);
  metrics.avgServiceTime = getAverage(
    processes.map((process) => process.burstTime)
  );

  console.log(chart);
  console.log(metrics);

  return { chart, metrics };
};

// runAlgorithm(formData);
