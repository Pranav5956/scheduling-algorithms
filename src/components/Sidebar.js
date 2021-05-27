import {
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  sidebar: {
    width: "30%",
    margin: "5rem 2.5% 2rem",
    padding: "2rem 1rem 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "visible",
    height: "fit-content",
    maxHeight: "84vh",
    boxShadow: "0 0 10px 4px rgba(0, 0, 0, 0.2)",
  },
  heading: {
    fontSize: "1.8rem",
    padding: "1rem 3rem 1.5rem",
    width: "90%",
    background: theme.palette.secondary.main,
    color: "white",
    borderRadius: "4px",
    position: "absolute",
    top: "-2.5rem",
    left: "0",
    margin: "0 5%",
    boxShadow: "0 3px 10px 6px rgba(0, 0, 0, 0.2)",
  },
  formSelect: {
    margin: "1rem 5% 1rem 0",
    width: "70%",
  },
  quantum: {
    margin: "1rem 0",
    width: "25%",
  },
  queueCount: { width: "100%", marginTop: "1rem" },
  processMetrics: {
    width: "100%",
    marginBottom: "1rem",
  },
  button: {
    margin: "1rem 4.8rem",
  },
  algorithms: {
    margin: "1.2rem 0",
  },
}));

const Sidebar = ({
  algorithmSettings,
  setAlgorithmSettings,
  handleChange,
  executeAlgorithm,
  onChangeQueueCount,
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.sidebar}>
      <CardContent>
        <Typography
          color="textSecondary"
          variant="h3"
          align="center"
          className={classes.heading}>
          Scheduling Algorithms
        </Typography>
        <form noValidate autoComplete="off">
          {/* <TextField
            name="queueCount"
            label="Number of Queues"
            variant="outlined"
            color="secondary"
            type="number"
            inputProps={{ min: 1, max: 2 }}
            value={algorithmSettings.queueCount}
            onChange={onChangeQueueCount}
            className={classes.queueCount}
          /> */}
          <div className={classes.algorithms}>
            {algorithmSettings.algorithms.map((_, index) => (
              <div className="algorithm" key={`algorithm-${index + 1}`}>
                <FormControl
                  variant="outlined"
                  color="secondary"
                  className={classes.formSelect}>
                  <InputLabel id="algorithms">
                    Choose algorithm for queue #{`${index + 1}`}
                  </InputLabel>
                  <Select
                    labelId="algorithms"
                    value={algorithmSettings.algorithms[index].algorithm}
                    onChange={(e) => {
                      let updatedAlgorithms = algorithmSettings.algorithms;
                      updatedAlgorithms[index].algorithm = e.target.value;
                      setAlgorithmSettings((algorithmSettings) => ({
                        ...algorithmSettings,
                        algorithms: [...updatedAlgorithms],
                      }));
                    }}
                    label={`Choose algorithm for queue #${index + 1}`}
                    name="algorithm">
                    <MenuItem value="FCFS">First Come First Served</MenuItem>
                    <MenuItem value="SJF">Shortest Job First</MenuItem>
                    <MenuItem value="SJRF">
                      Shortest Job Remaining First
                    </MenuItem>
                    <MenuItem value="P">Priority Scheduling</MenuItem>
                    <MenuItem value="PP">
                      Pre-emptive Priority Scheduling
                    </MenuItem>
                    <MenuItem value="RR">Round-Robin Scheduling</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  name="quantum"
                  label="Quantum"
                  variant="outlined"
                  color="secondary"
                  type="number"
                  shrink
                  inputProps={{ min: 1, max: 8 }}
                  value={algorithmSettings.algorithms[index].quantum}
                  onChange={(e) => {
                    let updatedAlgorithms = algorithmSettings.algorithms;

                    updatedAlgorithms[index].quantum = Math.max(
                      Math.min(e.target.value, 8),
                      1
                    );
                    setAlgorithmSettings((algorithmSettings) => ({
                      ...algorithmSettings,
                      algorithms: [...updatedAlgorithms],
                    }));
                  }}
                  className={classes.quantum}
                />
              </div>
            ))}
          </div>

          <TextField
            name="arrivalTimes"
            label="Arrival Times"
            variant="outlined"
            color="secondary"
            value={algorithmSettings.arrivalTimes}
            onChange={(e) => {
              setAlgorithmSettings((algorithmSettings) => ({
                ...algorithmSettings,
                arrivalTimes: e.target.value,
              }));
            }}
            className={classes.processMetrics}
          />
          <TextField
            name="burstTimes"
            label="Burst Times"
            variant="outlined"
            color="secondary"
            value={algorithmSettings.burstTimes}
            onChange={(e) => {
              setAlgorithmSettings((algorithmSettings) => ({
                ...algorithmSettings,
                burstTimes: e.target.value,
              }));
            }}
            className={classes.processMetrics}
          />
          <TextField
            name="priorities"
            label="Priority (optional)"
            variant="outlined"
            color="secondary"
            value={algorithmSettings.priorities}
            onChange={(e) => {
              setAlgorithmSettings((algorithmSettings) => ({
                ...algorithmSettings,
                priorities: e.target.value,
              }));
            }}
            className={classes.processMetrics}
          />
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={executeAlgorithm}>
            Run Scheduling Algorithm
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Sidebar;
