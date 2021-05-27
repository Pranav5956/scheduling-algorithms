import { useState } from "react";
import "./App.css";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";
import Sidebar from "./components/Sidebar";
import { runAlgorithm } from "./algorithms";
import AlgorithmResultView from "./components/AlgorithmResultView";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

function App() {
  const [algorithmSettings, setAlgorithmSettings] = useState({
    queueCount: 1,
    algorithms: [
      {
        algorithm: "FCFS",
        quantum: 0,
      },
    ],
    arrivalTimes: "0 2 3 7 8 15 12",
    burstTimes: "3 6 10 1 5 2 7",
    priorities: "2 1 3 4 5 2 1",
  });
  const [metrics, setMetrics] = useState(null);

  const onChangeQueueCount = (e) => {
    const newQueueCount = e.target.value;
    const oldQueueCount = algorithmSettings.algorithms.length;

    if (newQueueCount > oldQueueCount)
      setAlgorithmSettings((algorithmSettings) => ({
        ...algorithmSettings,
        queueCount: newQueueCount,
        algorithms: [
          ...algorithmSettings.algorithms,
          { algorithm: "FCFS", quantum: 0 },
        ],
      }));
    else
      setAlgorithmSettings((algorithmSettings) => ({
        ...algorithmSettings,
        queueCount: newQueueCount,
        algorithms: algorithmSettings.algorithms.slice(0, newQueueCount),
      }));
  };

  const executeAlgorithm = () => {
    const settings = {
      ...algorithmSettings,
      arrivalTimes: algorithmSettings.arrivalTimes
        .split(" ")
        .map((n) => parseInt(n)),
      burstTimes: algorithmSettings.burstTimes
        .split(" ")
        .map((n) => parseInt(n)),
      priorities: algorithmSettings.priorities
        .split(" ")
        .map((n) => parseInt(n)),
    };
    console.log(settings);
    setMetrics(runAlgorithm(settings));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="app">
        <Sidebar
          algorithmSettings={algorithmSettings}
          setAlgorithmSettings={setAlgorithmSettings}
          executeAlgorithm={executeAlgorithm}
          onChangeQueueCount={onChangeQueueCount}
          className="sidebar"
        />
        <AlgorithmResultView
          metrics={metrics}
          className="algorithmResultView"
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
