import { useEffect, useState } from "react";
import { Grid, Statistic, Container } from "semantic-ui-react";

import { useGlobalStats } from "../api/api";

const GlobalStats = () => {
  const { globalStats, isLoading, error } = useGlobalStats();
  const [newStats, setNewStats] = useState([]);

  const renameObj = {
    monitor_count: "Monitors",
    monitor_alive_count: "Alive Monitors",
    uptime_percentage: "Overall Uptime",
    response_time_average: "Average Response Time",
    response_time_min: "Minimum Response Time",
    response_time_max: "Maximum Response Time",
  };

  useEffect(() => {
    const arr = [];
    for (const key in globalStats) {
      var re = new RegExp(Object.keys(renameObj).join("|"), "gi");
      let newKeyName = key.replace(re, function (matched) {
        return renameObj[matched.toLowerCase()];
      });
      arr.push({ name: newKeyName, value: globalStats[key] });
    }
    setNewStats(arr);
  }, {});

  return (
    <Grid relaxed centered columns={3} celled className="global-stats">
      {globalStats && (
        <>
          <Grid.Row>
            <Grid.Column cente>
              <Container>
                <Statistic
                  label="Monitors"
                  value={globalStats.monitor_count}
                ></Statistic>
              </Container>
            </Grid.Column>
            <Grid.Column>
              <Statistic
                label="Alive Monitors"
                value={globalStats.monitor_alive_count}
              ></Statistic>
            </Grid.Column>
            <Grid.Column>
              <Statistic
                label="Dead Monitors"
                value={
                  globalStats.monitor_count - globalStats.monitor_alive_count
                }
              ></Statistic>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Statistic
                label="Overall Uptime (%)"
                value={Number(globalStats.uptime_percentage * 100).toFixed(2)}
              ></Statistic>
            </Grid.Column>
            <Grid.Column>
              <Statistic
                label="Average Response Time (s)"
                value={Number(globalStats.response_time_average).toFixed(2)}
              ></Statistic>
            </Grid.Column>
            <Grid.Column>
              <Statistic
                label="Max Response Time (s)"
                value={Number(globalStats.response_time_max).toFixed(2)}
              ></Statistic>
            </Grid.Column>
          </Grid.Row>
        </>
      )}
    </Grid>
  );
};

export default GlobalStats;
