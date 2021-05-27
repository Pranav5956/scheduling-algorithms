// let formData = [
//   { name: "algorithm", value: "FCFS" },
//   { name: "quantum", value: "0" },
//   { name: "arrivalTimes", value: "0 2 3 7 8 15 12" },
//   { name: "burstTimes", value: "3 6 10 1 5 2 7" },
//   { name: "priorities", value: "2 1 3 4 5 2 1" },
// ];

function createProcess(formData) {
  var arrivalTimes = formData[2]["value"].split(" ");
  var burstTimes = formData[3]["value"].split(" ");
  var priorities = formData[4]["value"].split(" ");
  var N = arrivalTimes.length;
  var P = [];
  for (var i = 0; i < N; i++) {
    process = {
      PID: "P" + String(i + 1),
      arrivalTime: parseInt(arrivalTimes[i]),
      burstTime: parseInt(burstTimes[i]),
      priority: parseInt(priorities[i]),
      completed: 0,
    };
    P.push(process);
  }
  return P;
}

export function runAlgorithm(formData) {
  var P = createProcess(formData);
  let metrics = {
    waitTime: [],
    turnAroundTime: [],
    completionTime: [],
    avgWaitTime: 0,
    avgTurnAroundTime: 0,
  };
  switch (formData[0].value) {
    case "FCFS":
      return FCFS(P, metrics);
    case "SJF":
      return SJF(P, metrics);
    case "SJRF":
      return Priority(P, 1, metrics);
    case "PR":
      return Priority(P, 0, metrics);
  }
}

// callable function
function FCFS(P, metrics) {
  var chart = [];
  P.sort(function (p1, p2) {
    return p1.arrivalTime - p2.arrivalTime;
  });
  metrics.completionTime.push(P[0].burstTime);
  var i,
    j,
    N = P.length;
  for (i = 1; i < N; i++)
    metrics.completionTime.push(metrics.completionTime[i - 1] + P[i].burstTime);
  for (i = 0; i < N; i++)
    metrics.turnAroundTime.push(metrics.completionTime[i] - P[i].arrivalTime);
  var counter = 0;
  for (i = 0; i < N; i++) {
    metrics.waitTime.push(metrics.turnAroundTime[i] - P[i].burstTime);
    metrics.avgWaitTime += metrics.waitTime[i];
    metrics.avgTurnAroundTime += metrics.turnAroundTime[i];
    for (j = 1; j <= P[i].burstTime; j++) {
      chart.push({
        PID: P[i].PID,
        arrivalTime: P[i].arrivalTime,
        burstTime: P[i].burstTime,
        burstLeft: P[i].burstTime - j,
        timer: counter + j,
      });
    }
    counter = counter + P[i].burstTime;
  }

  metrics.avgWaitTime /= N;
  metrics.avgTurnAroundTime /= N;
  console.log(metrics);
  console.log(chart);
  return { ...metrics, chart };
}

function allDone(P) {
  for (var i = 0; i < P.length; i++) if (P[i].completed == 0) return 0;
  return 1;
}

// callable function
function SJF(P, metrics) {
  var chart = [];
  P.sort(function (p1, p2) {
    return p1.arrivalTime - p2.arrivalTime;
  });
  var N = P.length,
    counter = 0;
  metrics.avgWaitTime = metrics.waitTime[0] = 0;
  metrics.completionTime[0] = P[0].burstTime;
  metrics.turnAroundTime[0] = metrics.avgTurnAroundTime =
    metrics.completionTime[0] - P[0].arrivalTime;
  P[0].completed = 1;
  for (let j = 1; j <= P[0].burstTime; j++) {
    chart.push({
      PID: P[0].PID,
      arrivalTime: P[0].arrivalTime,
      burstTime: P[0].burstTime,
      burstLeft: P[0].burstTime - j,
      timer: counter + j,
    });
  }
  counter = counter + P[0].burstTime;
  var curindex = 0,
    previndex = 0;
  while (allDone(P) == 0) {
    previndex = curindex;
    var maxBurst = 1000;
    for (var i = 0; i < P.length; i++) {
      if (
        P[i].burstTime < maxBurst &&
        P[i].completed == 0 &&
        P[i].arrivalTime <= metrics.completionTime[previndex]
      ) {
        curindex = i;
        maxBurst = P[i].burstTime;
      }
    }
    metrics.completionTime[curindex] =
      metrics.completionTime[previndex] + P[curindex].burstTime;
    metrics.turnAroundTime[curindex] =
      metrics.completionTime[curindex] - P[curindex].arrivalTime;
    metrics.waitTime[curindex] =
      metrics.turnAroundTime[curindex] - P[curindex].burstTime;
    metrics.avgWaitTime += metrics.waitTime[curindex];
    metrics.avgTurnAroundTime += metrics.turnAroundTime[curindex];
    P[curindex].completed = 1;
    for (let j = 1; j <= P[curindex].burstTime; j++) {
      chart.push({
        PID: P[curindex].PID,
        arrivalTime: P[curindex].arrivalTime,
        burstTime: P[curindex].burstTime,
        burstLeft: P[curindex].burstTime - j,
        timer: counter + j,
      });
    }
    counter = counter + P[curindex].burstTime;
  }
  metrics.avgWaitTime /= N;
  metrics.avgTurnAroundTime /= N;
  console.log(chart);
  console.log(metrics);
  return { ...metrics, chart };
}

function preemptSJF(P, timer, current, BurstLeft) {
  var newCurrent = -1;
  if (BurstLeft[current] == 0) {
    var maxBurst = 1000;
    for (var i = 0; i < P.length; i++) {
      if (
        P[i].arrivalTime <= timer &&
        P[i].completed == 0 &&
        BurstLeft[i] < maxBurst
      ) {
        newCurrent = i;
        maxBurst = BurstLeft[i];
      }
    }
  } else {
    for (var i = 0; i < P.length; i++) {
      if (
        P[i].arrivalTime <= timer &&
        P[i].completed == 0 &&
        P[i].burstTime < BurstLeft[current]
      )
        newCurrent = i;
    }
  }
  return newCurrent;
}

function preemptPriority(P, timer, current, BurstLeft) {
  var newCurrent = -1;
  if (BurstLeft[current] == 0) {
    var minPriority = 1000,
      loc;
    for (var i = 0; i < P.length; i++) {
      if (
        P[i].arrivalTime <= timer &&
        P[i].completed == 0 &&
        P[i].priority < minPriority
      ) {
        minPriority = P[i].priority;
        newCurrent = i;
      }
    }
    // return loc;
  } else {
    for (var i = 0; i < P.length; i++) {
      if (
        P[i].arrivalTime <= timer &&
        P[i].completed == 0 &&
        P[i].priority < P[current].priority
      )
        newCurrent = i;
    }
    // return newCurrent;
  }
  return newCurrent;
}

// callable function, type=0 for preemptive priority, 1 for preemptive SJF
function Priority(P, type, metrics) {
  var BurstLeft = [],
    chart = [];
  var N = P.length;
  for (var i = 0; i < P.length; i++) BurstLeft[i] = P[i].burstTime;
  P.sort(function (p1, p2) {
    return p1.arrivalTime - p2.arrivalTime;
  });
  metrics.avgWaitTime = metrics.waitTime[0] = 0;
  metrics.avgTurnAroundTime = 0;
  var counter = 0,
    curindex = 0;
  while (allDone(P) == 0) {
    var newProcess;
    if (type == 0)
      newProcess = preemptPriority(P, counter, curindex, BurstLeft);
    else if (type == 1)
      newProcess = preemptSJF(P, counter, curindex, BurstLeft);
    if (newProcess != -1) curindex = newProcess;
    BurstLeft[curindex] -= 1;
    counter += 1;
    chart.push({
      PID: P[curindex].PID,
      arrivalTime: P[curindex].arrivalTime,
      burstTime: P[curindex].burstTime,
      burstLeft: BurstLeft[curindex],
      timer: counter,
    });
    if (BurstLeft[curindex] == 0) {
      metrics.completionTime[curindex] = counter;
      metrics.turnAroundTime[curindex] =
        metrics.completionTime[curindex] - P[curindex].arrivalTime;
      metrics.waitTime[curindex] =
        metrics.turnAroundTime[curindex] - P[curindex].burstTime;
      metrics.avgWaitTime += metrics.waitTime[curindex];
      metrics.avgTurnAroundTime += metrics.turnAroundTime[curindex];
      P[curindex].completed = 1;
    }
  }
  metrics.avgWaitTime /= N;
  metrics.avgTurnAroundTime /= N;
  console.log(metrics);
  console.log(chart);
  return { ...metrics, chart };
}

var RRqueue = [],
  front = -1,
  rear = -1;

function AddProcess(value, queue) {
  if (front == -1) front = 0;
  rear++;
  queue[rear] = value;
}

function removeProcess(queue) {
  var process = -1;
  if (front == -1) console.log("Empty Queue");
  else {
    process = queue[front];
    front++;
    if (front > rear) front = rear = -1;
  }
  return process;
}

function present(loc, N, queue) {
  for (var i = 0; i < N; i++) {
    if (queue[i] == loc) return 1;
  }
  return 0;
}

function updateReadyQueue(P, start, end, current, queue) {
  var N = P.length;
  for (var i = 0; i < N; i++) {
    if (
      P[i].arrivalTime >= start &&
      P[i].arrivalTime <= end &&
      P[i].completed == 0 &&
      !present(i, N, queue)
    )
      AddProcess(i, queue);
  }
  if (!P[current].completed) AddProcess(current, queue);
}

// callable function
function RoundRobin(P, quantum, metrics) {
  var BurstLeft = [],
    chart = [];
  var N = P.length;
  for (var i = 0; i < N; i++) BurstLeft[i] = P[i].burstTime;
  metrics.avgWaitTime = metrics.waitTime[0] = 0;
  metrics.avgTurnAroundTime = 0;
  var counter = 0,
    curindex = 0;
  AddProcess(0, RRqueue);
  while (allDone(P) == 0) {
    var curindex = removeProcess(RRqueue);
    var start = counter;
    for (var j = 1; j <= quantum; j++) {
      chart.push({
        PID: P[curindex].PID,
        arrivalTime: P[curindex].arrivalTime,
        burstTime: P[curindex].burstTime,
        burstLeft: BurstLeft[curindex] - j,
        timer: counter + j,
      });
      if (BurstLeft[curindex] - j == 0) break;
    }
    if (BurstLeft[curindex] <= quantum) {
      counter += BurstLeft[curindex];
      BurstLeft[curindex] = 0;
      P[curindex].completed = 1;
      metrics.completionTime[curindex] = counter;
      metrics.turnAroundTime[curindex] =
        metrics.completionTime[curindex] - P[curindex].arrivalTime;
      metrics.waitTime[curindex] =
        metrics.turnAroundTime[curindex] - P[curindex].burstTime;
      metrics.avgWaitTime += metrics.waitTime[curindex];
      metrics.avgTurnAroundTime += metrics.turnAroundTime[curindex];
    } else {
      BurstLeft[curindex] -= quantum;
      counter += quantum;
    }
    updateReadyQueue(P, start, counter, curindex, RRqueue);
  }
  metrics.avgWaitTime /= N;
  metrics.avgTurnAroundTime /= N;
  console.log(metrics);
  console.log(chart);
  return { ...metrics, chart };
}
