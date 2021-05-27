import {
  Badge,
  Card,
  CardContent,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  withStyles,
} from "@material-ui/core";

const StyledBadge = withStyles({
  badge: {
    bottom: "1.75rem",
  },
})(Badge);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "62.5%",
    margin: "5rem 1.25% 2rem 0",
    padding: "1rem 1rem 0",
    display: "flex",
    position: "relative",
    overflow: "visible",
    boxShadow: "0 0 10px 4px rgba(0, 0, 0, 0.2)",
  },
  heading: {
    fontSize: "1.8rem",
    padding: "1rem 3rem 1.5rem",
    width: "90%",
    background: theme.palette.primary.main,
    color: "white",
    borderRadius: "4px",
    position: "absolute",
    top: "-2.5rem",
    left: "0",
    margin: "0 5%",
    boxShadow: "0 3px 10px 6px rgba(0, 0, 0, 0.2)",
  },
  subHeading: {
    marginTop: "1.4rem",
    marginBottom: "1rem",
    fontSize: "1.6rem",
    textTransform: "uppercase",
  },
  table: {
    width: "100%",
    marginTop: "2rem",
    boxShadow: "0 0 10px 4px rgba(0, 0, 0, 0.2)",
    marginBottom: "1rem",
  },
  metricsText: {
    marginTop: "0.5rem",
  },
  chart: {
    margin: "2rem 1rem 0.5rem",
    padding: "0",
  },
  chartContent: {
    padding: "0 0.5rem",
    width: "4vw",
    height: "4vw",
    backgroundColor: theme.palette.action.hover,
    marginBottom: "1.75rem",
  },
  chartContentComplete: {
    backgroundColor: "#00c853",
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const AlgorithmResultView = ({ metrics }) => {
  const classes = useStyles();
  const algorithmMetrics = metrics?.metrics;

  return (
    <Card className={classes.root}>
      <CardContent style={{ flex: "1" }}>
        <Typography
          color="textSecondary"
          variant="h3"
          align="center"
          className={classes.heading}>
          Process Scheduling Output
        </Typography>
        {!metrics && (
          <div className="process-display-hint">
            <Typography
              color="textPrimary"
              variant="h4"
              align="center"
              style={{ fontSize: "1.4rem" }}>
              Run a scheduling algorithm to view the results!
            </Typography>
          </div>
        )}
        {metrics && (
          <div className="process-display">
            <div className="gantt-chart">
              <Typography
                color="textPrimary"
                variant="h4"
                className={classes.subHeading}
                style={{ marginLeft: "1rem" }}>
                Scheduling Sequence
              </Typography>
              <div className="sequence">
                {metrics.chart.map(
                  ({ tick, process: { PID, burstTime, burstLeft } }, index) => (
                    <StyledBadge
                      className={classes.chart}
                      key={`chart-${index}`}
                      color="primary"
                      badgeContent={`${burstTime - burstLeft}/${burstTime}`}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}>
                      <Card
                        className={`${classes.chartContent} ${
                          burstLeft === 0 && classes.chartContentComplete
                        }`}>
                        <CardContent>
                          <Typography
                            color="textPrimary"
                            variant="h6"
                            align="center"
                            style={{ lineHeight: 1.2 }}>
                            {PID}
                          </Typography>

                          <Typography
                            color="textPrimary"
                            variant="caption"
                            align="center"
                            className="timer">
                            t={tick}s
                          </Typography>
                        </CardContent>
                      </Card>
                    </StyledBadge>
                  )
                )}
              </div>
            </div>
            <div className="metrics">
              <Typography
                color="textPrimary"
                variant="h4"
                className={classes.subHeading}>
                Scheduling Metrics
              </Typography>
              <TableContainer component={Paper} className={classes.table}>
                <Table aria-label="simple table">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell align="center">
                        Process ID
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Waiting Time (in seconds)
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Turn-Around Time (in seconds)
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Completion Time (in seconds)
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {algorithmMetrics.waitTime.map((_, index) => (
                      <StyledTableRow key={`metrics-row-${index}`}>
                        <StyledTableCell
                          align="center"
                          component="th"
                          scope="row">
                          {String.fromCharCode(65 + index)}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {algorithmMetrics.waitTime[index]}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {algorithmMetrics.turnAroundTime[index]}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {algorithmMetrics.completionTime[index]}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                    <StyledTableRow>
                      <StyledTableCell
                        align="center"
                        style={{ fontWeight: "bold" }}
                        component="th"
                        scope="row">
                        Average
                      </StyledTableCell>
                      <StyledTableCell
                        style={{ fontWeight: "bold" }}
                        align="center">
                        {algorithmMetrics.avgWaitTime.toFixed(2)}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{ fontWeight: "bold" }}
                        align="center">
                        {algorithmMetrics.avgTurnAroundTime.toFixed(2)}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{ fontWeight: "bold" }}
                        align="center">
                        {(
                          algorithmMetrics.completionTime.reduce(
                            (sum, current) => sum + current
                          ) / algorithmMetrics.completionTime.length
                        ).toFixed(2)}
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlgorithmResultView;
