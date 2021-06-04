import React from "react";
import { nanoid } from "nanoid";
import { Container, Divider } from "semantic-ui-react";

import MonitorEntry from "./MonitorEntry";
import { useCurrentStatus, useGlobalStats, useMonitors } from "../api/api";

const MonitorList = () => {
  const { monitors, isLoading, isError } = useMonitors(60000);
  const { currentStatus } = useCurrentStatus(60000);
  const { globalStats } = useGlobalStats(60000);

  return (
    <Container>
      {isError && (
        <Container key={nanoid()}>Could not retrieve monitors...</Container>
      )}
      {monitors && monitors.length === 0 && (
        <Container>Add your first monitor</Container>
      )}
      {monitors &&
        currentStatus &&
        monitors.map((monitor, i) => {
          return (
            <div key={nanoid()}>
              <MonitorEntry
                name={monitor.name}
                host={monitor.host}
                alive={
                  currentStatus.find((status) => status.name === monitor.name)
                    ? currentStatus.find(
                        (status) => status.name === monitor.name
                      ).is_alive
                    : false
                }
                updatedAt={
                  currentStatus.find((status) => status.name === monitor.name)
                    ? currentStatus.find(
                        (status) => status.name === monitor.name
                      ).checked_at
                    : "Never"
                }
                uptime={
                  currentStatus.find((status) => status.name === monitor.name)
                    ? currentStatus.find(
                        (status) => status.name === monitor.name
                      ).uptime
                    : "Never"
                }
                refreshInterval={`Every ${
                  monitor.refresh_interval / 60
                } minute(s)`}
                lastResponse={
                  currentStatus.find((status) => status.name === monitor.name)
                    ? {
                        code: currentStatus.find(
                          (status) => status.name === monitor.name
                        ).status_code,
                        time: currentStatus.find(
                          (status) => status.name === monitor.name
                        ).response_time,
                      }
                    : { code: "Never", time: "Never" }
                }
              />
              {monitors[i + 1] ? <Divider key={nanoid()} /> : ""}
            </div>
          );
        })}
    </Container>
  );
};

export default MonitorList;
