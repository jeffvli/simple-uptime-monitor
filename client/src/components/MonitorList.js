import React from "react";
import { nanoid } from "nanoid";
import {
  Container,
  Item,
  Grid,
  Divider,
  Placeholder,
  Button,
} from "semantic-ui-react";

import MonitorEntry from "./MonitorEntry";
import { useCurrentStatus, useMonitors, useUptime } from "../api/api";

const MonitorList = () => {
  const { monitors, isLoading, isError } = useMonitors(60000);
  const { currentStatus } = useCurrentStatus(60000);
  const { uptime } = useUptime(60000);

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
        uptime &&
        monitors.map((monitor, i) => {
          return (
            <Container key={nanoid()}>
              <Item.Group divided>
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
                    uptime.find((status) => status.name === monitor.name)
                      ? uptime.find((status) => status.name === monitor.name)
                          .uptime
                      : "Never"
                  }
                />
              </Item.Group>
              {monitors[i + 1] ? <Divider key={nanoid()} /> : ""}
            </Container>
          );
        })}
    </Container>
  );
};

export default MonitorList;
